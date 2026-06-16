import { Router } from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { pool } from "../db.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Lifetime plan price — flat £29.99 = 2999 pence, in the same currency as
// the one-time products. Changing this is a code change, not a DB edit.
const LIFETIME_PRICE_CENTS = 2999;
const LIFETIME_CURRENCY = "gbp";

router.get("/lifetime-plan", (_req, res) => {
  res.json({ priceCents: LIFETIME_PRICE_CENTS, currency: LIFETIME_CURRENCY });
});

router.post("/create-payment-intent", async (req, res) => {
  const { templateId, kind } = req.body || {};
  const purchaseKind = kind === "lifetime" ? "lifetime" : "one_time";

  if (purchaseKind === "lifetime") {
    // Lifetime requires a logged-in user so we can flip their plan on success.
    if (!req.user) return res.status(401).json({ error: "Log in to buy the lifetime plan." });
    if (!req.user.email_verified_at) {
      return res.status(403).json({ error: "Please verify your email before purchasing the lifetime plan." });
    }
    if (req.user.plan === "lifetime") {
      return res.status(409).json({ error: "You already have lifetime access." });
    }

    const intent = await stripe.paymentIntents.create({
      amount: LIFETIME_PRICE_CENTS,
      currency: LIFETIME_CURRENCY,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      description: "iCover CV Builder — Lifetime access to all templates",
      metadata: { kind: "lifetime", user_id: String(req.user.id) },
      receipt_email: req.user.email,
    });

    await pool.query(
      `INSERT INTO payments (stripe_payment_intent_id, template_id, amount_cents, currency, purchase_kind, user_id, customer_email, status)
       VALUES (?, NULL, ?, ?, 'lifetime', ?, ?, 'pending')`,
      [intent.id, LIFETIME_PRICE_CENTS, LIFETIME_CURRENCY, req.user.id, req.user.email]
    );

    return res.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amountCents: LIFETIME_PRICE_CENTS,
      currency: LIFETIME_CURRENCY,
      templateName: "Lifetime access (all templates)",
      kind: "lifetime",
    });
  }

  // ---- one-time template purchase (existing flow) ----
  if (!templateId) return res.status(400).json({ error: "templateId required" });

  const [rows] = await pool.query(
    "SELECT id, name, price_cents, currency FROM templates WHERE id = ?",
    [templateId]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Template not found" });
  const t = rows[0];

  const intent = await stripe.paymentIntents.create({
    amount: t.price_cents,
    currency: t.currency,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    description: `iCover CV Builder — ${t.name} template download`,
    metadata: {
      template_id: t.id,
      template_name: t.name,
      ...(req.user ? { user_id: String(req.user.id) } : {}),
    },
  });

  await pool.query(
    `INSERT INTO payments (stripe_payment_intent_id, template_id, amount_cents, currency, purchase_kind, user_id, status)
     VALUES (?, ?, ?, ?, 'one_time', ?, 'pending')`,
    [intent.id, t.id, t.price_cents, t.currency, req.user?.id || null]
  );

  res.json({
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amountCents: t.price_cents,
    currency: t.currency,
    templateName: t.name,
    kind: "one_time",
  });
});

// Persist the customer's billing details on the payment row before they submit the card.
// Called from the "Continue → Payment" step.
router.post("/save-customer-details", async (req, res) => {
  const { paymentIntentId, email, name, phone, address } = req.body || {};
  if (!paymentIntentId) return res.status(400).json({ error: "paymentIntentId required" });

  const a = address || {};
  const [result] = await pool.query(
    `UPDATE payments
       SET customer_email     = ?,
           customer_name      = ?,
           customer_phone     = ?,
           address_line1      = ?,
           address_line2      = ?,
           address_city       = ?,
           address_state      = ?,
           address_postal_code = ?,
           address_country    = ?
     WHERE stripe_payment_intent_id = ?`,
    [
      email || null,
      name || null,
      phone || null,
      a.line1 || null,
      a.line2 || null,
      a.city || null,
      a.state || null,
      a.postal_code || null,
      a.country || null,
      paymentIntentId,
    ]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: "Payment not found" });
  res.json({ ok: true });
});

// Frontend polls this after stripe.confirmPayment resolves to grab the one-time token.
router.get("/payment-status/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT status, download_token, token_consumed_at FROM payments WHERE stripe_payment_intent_id = ?",
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Payment not found" });
  const p = rows[0];
  res.json({
    status: p.status,
    downloadToken: p.status === "succeeded" && !p.token_consumed_at ? p.download_token : null,
  });
});

// Fallback when the webhook hasn't arrived yet (e.g. local dev without Stripe CLI).
// We verify the PaymentIntent directly with Stripe's API — server-side, so it can't be spoofed.
router.post("/confirm-payment", async (req, res) => {
  const { paymentIntentId } = req.body || {};
  if (!paymentIntentId) return res.status(400).json({ error: "paymentIntentId required" });

  const [existing] = await pool.query(
    "SELECT id, status, download_token, purchase_kind, user_id FROM payments WHERE stripe_payment_intent_id = ?",
    [paymentIntentId]
  );
  if (existing.length === 0) return res.status(404).json({ error: "Payment not found" });

  // Already confirmed via webhook? Return the existing token (or lifetime ack).
  if (existing[0].status === "succeeded" && (existing[0].download_token || existing[0].purchase_kind === "lifetime")) {
    return res.json({
      status: "succeeded",
      downloadToken: existing[0].download_token || null,
      kind: existing[0].purchase_kind,
    });
  }

  // Ask Stripe directly.
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== "succeeded") {
    return res.json({ status: pi.status, downloadToken: null });
  }

  if (existing[0].purchase_kind === "lifetime") {
    // Mark payment succeeded and flip the user's plan. Atomic transaction
    // so we never end up with a paid row but an un-upgraded user.
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        `UPDATE payments
           SET status = 'succeeded',
               customer_email = COALESCE(customer_email, ?)
         WHERE stripe_payment_intent_id = ?`,
        [pi.receipt_email || null, pi.id]
      );
      if (existing[0].user_id) {
        await conn.query(
          "UPDATE users SET plan = 'lifetime' WHERE id = ?",
          [existing[0].user_id]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    return res.json({ status: "succeeded", downloadToken: null, kind: "lifetime" });
  }

  // ---- one-time path: issue a download token ----
  const token = crypto.randomBytes(32).toString("hex");
  await pool.query(
    `UPDATE payments
       SET status = 'succeeded',
           download_token = COALESCE(download_token, ?),
           customer_email = COALESCE(customer_email, ?)
     WHERE stripe_payment_intent_id = ?`,
    [token, pi.receipt_email || null, pi.id]
  );

  const [refreshed] = await pool.query(
    "SELECT download_token FROM payments WHERE stripe_payment_intent_id = ?",
    [paymentIntentId]
  );
  res.json({ status: "succeeded", downloadToken: refreshed[0].download_token, kind: "one_time" });
});

export default router;
