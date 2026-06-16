import { Router } from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { pool } from "../db.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// IMPORTANT: this route must receive the RAW body (mounted with express.raw in index.js).
router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    // Look up the payment to find out whether it's one-time or lifetime.
    const [rows] = await pool.query(
      "SELECT id, purchase_kind, user_id FROM payments WHERE stripe_payment_intent_id = ?",
      [pi.id]
    );
    if (rows.length) {
      const row = rows[0];
      if (row.purchase_kind === "lifetime") {
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
          if (row.user_id) {
            await conn.query("UPDATE users SET plan = 'lifetime' WHERE id = ?", [row.user_id]);
          }
          await conn.commit();
        } catch (err) {
          await conn.rollback();
          throw err;
        } finally {
          conn.release();
        }
      } else {
        const token = crypto.randomBytes(32).toString("hex");
        await pool.query(
          `UPDATE payments
             SET status = 'succeeded',
                 download_token = COALESCE(download_token, ?),
                 customer_email = ?
           WHERE stripe_payment_intent_id = ?`,
          [token, pi.receipt_email || null, pi.id]
        );
      }
    }
  } else if (event.type === "payment_intent.payment_failed") {
    await pool.query(
      `UPDATE payments SET status = 'failed' WHERE stripe_payment_intent_id = ?`,
      [event.data.object.id]
    );
  }

  res.json({ received: true });
});

export default router;
