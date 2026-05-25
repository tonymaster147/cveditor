import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/templates", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, price_cents, currency FROM templates ORDER BY id"
  );
  res.json(rows);
});

router.get("/templates/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, price_cents, currency FROM templates WHERE id = ?",
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Template not found" });
  res.json(rows[0]);
});

export default router;
