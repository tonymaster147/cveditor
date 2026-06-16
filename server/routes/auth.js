import { Router } from "express";
import { pool } from "../db.js";
import {
  hashPassword,
  verifyPassword,
  signSession,
  setSessionCookie,
  clearSessionCookie,
  requireUser,
  generateResetToken,
  hashToken,
  rateLimit,
} from "../auth.js";
import { getTransporter, fromAddress } from "../mailer.js";

const router = Router();

// Minimum 8 chars. Frontend should validate too but we re-check here.
const PASSWORD_MIN = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validCreds(email, password) {
  return typeof email === "string"
    && EMAIL_RE.test(email)
    && typeof password === "string"
    && password.length >= PASSWORD_MIN;
}

router.post("/auth/signup",
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, key: "signup" }),
  async (req, res) => {
    const { email, password } = req.body || {};
    if (!validCreds(email, password)) {
      return res.status(400).json({ error: "Email or password is invalid." });
    }
    const normalised = email.trim().toLowerCase();

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?", [normalised]
    );
    if (existing.length) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const hash = await hashPassword(password);
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, plan) VALUES (?, ?, 'none')",
      [normalised, hash]
    );

    const user = { id: result.insertId, email: normalised, plan: "none" };
    setSessionCookie(res, signSession(user));
    res.json({ user });
  }
);

router.post("/auth/login",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10, key: "login" }),
  async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const normalised = email.trim().toLowerCase();
    const [rows] = await pool.query(
      "SELECT id, email, password_hash, plan FROM users WHERE email = ?",
      [normalised]
    );
    if (!rows.length || !(await verifyPassword(password, rows[0].password_hash))) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    const u = rows[0];
    setSessionCookie(res, signSession(u));
    res.json({ user: { id: u.id, email: u.email, plan: u.plan } });
  }
);

router.post("/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/auth/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  const { id, email, plan, created_at } = req.user;
  res.json({ user: { id, email, plan, created_at } });
});

router.post("/auth/change-password", requireUser, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof newPassword !== "string" || newPassword.length < PASSWORD_MIN) {
    return res.status(400).json({ error: `New password must be at least ${PASSWORD_MIN} characters.` });
  }
  const [rows] = await pool.query(
    "SELECT password_hash FROM users WHERE id = ?", [req.user.id]
  );
  if (!rows.length || !(await verifyPassword(currentPassword || "", rows[0].password_hash))) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }
  const hash = await hashPassword(newPassword);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, req.user.id]);
  res.json({ ok: true });
});

router.post("/auth/forgot-password",
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5, key: "forgot" }),
  async (req, res) => {
    const { email } = req.body || {};
    // Always respond identically — don't leak whether the email exists.
    const ok = () => res.json({ ok: true });

    if (typeof email !== "string" || !EMAIL_RE.test(email)) return ok();
    const normalised = email.trim().toLowerCase();

    const [users] = await pool.query("SELECT id, email FROM users WHERE email = ?", [normalised]);
    if (!users.length) return ok();
    const user = users[0];

    const raw = generateResetToken();
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, tokenHash, expiresAt]
    );

    const origin = (process.env.FRONTEND_ORIGIN || "http://localhost:5173").split(",")[0].trim();
    const resetUrl = `${origin}/cv-editor/reset-password?token=${raw}`;

    try {
      const t = getTransporter();
      await t.sendMail({
        from: fromAddress(),
        to: user.email,
        subject: "Reset your iCover password",
        text: [
          "Hi,",
          "",
          "Someone (hopefully you) asked to reset the password on your iCover account.",
          "",
          `Use this link to set a new password (valid for 1 hour):`,
          resetUrl,
          "",
          "If you didn't ask for this, ignore this email — your password stays the same.",
          "",
          "— iCover",
        ].join("\n"),
        html: `
          <p>Hi,</p>
          <p>Someone (hopefully you) asked to reset the password on your iCover account.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 18px;background:#FE7A33;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">
              Reset your password
            </a>
          </p>
          <p style="color:#666;font-size:12px">This link expires in 1 hour. If the button doesn't work, paste this URL into your browser:<br>
            <span style="word-break:break-all">${resetUrl}</span>
          </p>
          <p style="color:#666;font-size:12px">If you didn't ask for this, ignore this email — your password stays the same.</p>
        `,
      });
    } catch (err) {
      console.error("forgot-password email failed:", err);
      // Still respond ok — don't leak SMTP state.
    }

    ok();
  }
);

router.post("/auth/reset-password",
  rateLimit({ windowMs: 60 * 60 * 1000, max: 20, key: "reset" }),
  async (req, res) => {
    const { token, newPassword } = req.body || {};
    if (typeof token !== "string" || typeof newPassword !== "string" || newPassword.length < PASSWORD_MIN) {
      return res.status(400).json({ error: "Invalid request." });
    }
    const tokenHash = hashToken(token);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query(
        `SELECT id, user_id, expires_at, consumed_at
           FROM password_reset_tokens
          WHERE token_hash = ?
          FOR UPDATE`,
        [tokenHash]
      );
      if (!rows.length) {
        await conn.rollback();
        return res.status(400).json({ error: "Reset link is invalid or has been used." });
      }
      const t = rows[0];
      if (t.consumed_at) {
        await conn.rollback();
        return res.status(400).json({ error: "Reset link has already been used." });
      }
      if (new Date(t.expires_at).getTime() < Date.now()) {
        await conn.rollback();
        return res.status(400).json({ error: "Reset link has expired. Request a new one." });
      }

      const hash = await hashPassword(newPassword);
      await conn.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, t.user_id]);
      await conn.query("UPDATE password_reset_tokens SET consumed_at = NOW() WHERE id = ?", [t.id]);
      await conn.commit();
      res.json({ ok: true });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
);

export default router;
