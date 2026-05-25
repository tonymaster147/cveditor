import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// One-time redemption: marks the token consumed and returns the template id.
// Frontend then generates the PDF/DOCX client-side (same as before).
router.post("/redeem-download", async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: "token required" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query(
      `SELECT id, template_id, status, token_consumed_at
         FROM payments
        WHERE download_token = ?
        FOR UPDATE`,
      [token]
    );
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Invalid token" });
    }
    const p = rows[0];
    if (p.status !== "succeeded") {
      await conn.rollback();
      return res.status(403).json({ error: "Payment not completed" });
    }
    if (p.token_consumed_at) {
      await conn.rollback();
      return res.status(410).json({ error: "Token already used" });
    }
    await conn.query(
      "UPDATE payments SET token_consumed_at = NOW() WHERE id = ?",
      [p.id]
    );
    await conn.commit();
    res.json({ ok: true, templateId: p.template_id });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

export default router;
