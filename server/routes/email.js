import { Router } from "express";
import { pool } from "../db.js";
import { getTransporter, fromAddress } from "../mailer.js";

const router = Router();

// POST /api/email-receipt
// Frontend calls this from the Thank You page after generating the file.
// Body: { token, filename, contentType, fileBase64 }
// The token must match a payment whose download_token was consumed within the
// last 30 minutes — that's our proof the user is the legitimate buyer.
router.post("/email-receipt", async (req, res) => {
  const { token, filename, contentType, fileBase64 } = req.body || {};
  if (!token || !filename || !contentType || !fileBase64) {
    return res.status(400).json({ error: "token, filename, contentType, fileBase64 required" });
  }

  // Reject anything wildly oversized (base64 ~33% overhead; cap at ~18 MB of file).
  if (fileBase64.length > 24_000_000) {
    return res.status(413).json({ error: "File too large" });
  }

  const [rows] = await pool.query(
    `SELECT id, customer_email, customer_name, template_id, token_consumed_at, status
       FROM payments
      WHERE download_token = ?`,
    [token]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Invalid token" });
  const p = rows[0];

  if (p.status !== "succeeded") {
    return res.status(403).json({ error: "Payment not completed" });
  }
  if (!p.token_consumed_at) {
    return res.status(403).json({ error: "Token has not been redeemed" });
  }
  // Window the email permission to 30 minutes after redemption to prevent replay.
  const ageMs = Date.now() - new Date(p.token_consumed_at).getTime();
  if (ageMs > 30 * 60 * 1000) {
    return res.status(410).json({ error: "Email window expired" });
  }
  if (!p.customer_email) {
    return res.status(400).json({ error: "No customer email on file for this payment" });
  }

  const buffer = Buffer.from(fileBase64, "base64");

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: fromAddress(),
      to: p.customer_email,
      subject: "Your iCover CV is ready",
      text: [
        `Hi${p.customer_name ? " " + p.customer_name : ""},`,
        "",
        "Thank you for your purchase from iCover.",
        `Your "${p.template_id}" CV is attached.`,
        "",
        "If you need to re-download, open the link in the same browser within 24 hours.",
        "",
        "— iCover",
      ].join("\n"),
      html: `
        <p>Hi${p.customer_name ? " " + escapeHtml(p.customer_name) : ""},</p>
        <p>Thank you for your purchase from iCover.</p>
        <p>Your <strong>${escapeHtml(p.template_id)}</strong> CV is attached.</p>
        <p style="color:#666;font-size:12px">If you need to re-download, open the link in the same browser within 24 hours.</p>
        <p style="color:#666;font-size:12px">— iCover</p>
      `,
      attachments: [
        {
          filename,
          content: buffer,
          contentType,
        },
      ],
    });

    res.json({ ok: true, sentTo: p.customer_email });
  } catch (err) {
    console.error("email-receipt send failed:", err);
    res.status(502).json({ error: "Could not send email" });
  }
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

export default router;
