import { Router } from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { pool } from "../db.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  const { templateId } = req.body || {};
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
    // Required for India-registered Stripe accounts (RBI export-transaction rule):
    // every charge must carry a human-readable description of the goods/services.
    description: `iCover CV Builder — ${t.name} template download`,
    metadata: { template_id: t.id, template_name: t.name },
  });

  await pool.query(
    `INSERT INTO payments (stripe_payment_intent_id, template_id, amount_cents, currency, status)
     VALUES (?, ?, ?, ?, 'pending')`,
    [intent.id, t.id, t.price_cents, t.currency]
  );

  res.json({
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amountCents: t.price_cents,
    currency: t.currency,
    templateName: t.name,
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
    "SELECT id, status, download_token FROM payments WHERE stripe_payment_intent_id = ?",
    [paymentIntentId]
  );
  if (existing.length === 0) return res.status(404).json({ error: "Payment not found" });

  // Already confirmed via webhook? Return the existing token.
  if (existing[0].status === "succeeded" && existing[0].download_token) {
    return res.json({ status: "succeeded", downloadToken: existing[0].download_token });
  }

  // Ask Stripe directly.
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== "succeeded") {
    return res.json({ status: pi.status, downloadToken: null });
  }

  // Issue a token (same logic as the webhook).
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
  res.json({ status: "succeeded", downloadToken: refreshed[0].download_token });
});

export default router;
