// One-shot backfill: for every payments row missing customer details, fetch the
// PaymentIntent from Stripe and copy billing_details + receipt_email onto the row.
//
// Usage:
//   cd server
//   node backfill-customer-details.js          # dry run, prints what it would change
//   node backfill-customer-details.js --apply  # actually writes to MySQL

import "dotenv/config";
import Stripe from "stripe";
import { pool } from "./db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const apply = process.argv.includes("--apply");

function pick(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

async function main() {
  const [rows] = await pool.query(
    `SELECT id, stripe_payment_intent_id, status,
            customer_email, customer_name, address_line1
       FROM payments
      WHERE customer_email IS NULL
         OR customer_name  IS NULL
         OR address_line1  IS NULL
      ORDER BY id`
  );

  console.log(`Found ${rows.length} row(s) missing customer details.`);
  if (rows.length === 0) {
    await pool.end();
    return;
  }

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    const pid = row.stripe_payment_intent_id;
    try {
      const pi = await stripe.paymentIntents.retrieve(pid, {
        expand: ["latest_charge"],
      });

      // billing_details lives on the charge (or, as a fallback, on the PaymentMethod).
      const charge = pi.latest_charge && typeof pi.latest_charge === "object" ? pi.latest_charge : null;
      const bd = charge?.billing_details || null;

      // Fall back to PaymentMethod if no charge yet (rare for succeeded PIs).
      let pmBd = null;
      if (!bd && pi.payment_method) {
        try {
          const pm = await stripe.paymentMethods.retrieve(pi.payment_method);
          pmBd = pm?.billing_details || null;
        } catch { /* no PM available */ }
      }

      const source = bd || pmBd;
      const email = source?.email || pi.receipt_email || charge?.receipt_email || null;
      const name = source?.name || null;
      const phone = source?.phone || null;
      const a = source?.address || {};

      const hasAnything = email || name || a.line1 || a.city || a.postal_code || a.country;
      if (!hasAnything) {
        console.log(`#${row.id} ${pid} (status=${pi.status}) — Stripe has no billing details either, skipping.`);
        skipped++;
        continue;
      }

      console.log(`#${row.id} ${pid}`);
      console.log(`   email=${email || "—"}  name=${name || "—"}  phone=${phone || "—"}`);
      console.log(`   ${a.line1 || "—"}, ${a.city || "—"}, ${a.postal_code || "—"}, ${a.country || "—"}`);

      if (apply) {
        await pool.query(
          `UPDATE payments
             SET customer_email      = COALESCE(customer_email, ?),
                 customer_name       = COALESCE(customer_name, ?),
                 customer_phone      = COALESCE(customer_phone, ?),
                 address_line1       = COALESCE(address_line1, ?),
                 address_line2       = COALESCE(address_line2, ?),
                 address_city        = COALESCE(address_city, ?),
                 address_state       = COALESCE(address_state, ?),
                 address_postal_code = COALESCE(address_postal_code, ?),
                 address_country     = COALESCE(address_country, ?)
           WHERE id = ?`,
          [
            email, name, phone,
            a.line1 || null, a.line2 || null, a.city || null,
            a.state || null, a.postal_code || null, a.country || null,
            row.id,
          ]
        );
        updated++;
      }
    } catch (err) {
      console.error(`#${row.id} ${pid} — error: ${err.message}`);
      errors++;
    }
  }

  console.log("");
  console.log(apply
    ? `Done. Updated ${updated}, skipped ${skipped}, errors ${errors}.`
    : `Dry run only. Would update ~${rows.length - skipped} row(s). Re-run with --apply to write.`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
