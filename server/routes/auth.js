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
  generateOtp,
  hashToken,
  rateLimit,
} from "../auth.js";
import { getTransporter, fromAddress } from "../mailer.js";

const OTP_TTL_MIN = 10;          // valid for 10 minutes
const OTP_MAX_ATTEMPTS = 5;      // wrong codes before the row is wiped
const OTP_RESEND_COOLDOWN_S = 60; // seconds between resend requests

async function sendOtpEmail(toEmail, otp) {
  const t = getTransporter();
  await t.sendMail({
    from: fromAddress(),
    to: toEmail,
    subject: `Your iCover verification code: ${otp}`,
    text: [
      `Your iCover verification code is: ${otp}`,
      "",
      `It expires in ${OTP_TTL_MIN} minutes. If you didn't request this, ignore this email.`,
      "",
      "— iCover",
    ].join("\n"),
    html: `
      <p>Your iCover verification code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#111">${otp}</p>
      <p style="color:#666;font-size:12px">It expires in ${OTP_TTL_MIN} minutes. If you didn't request this, ignore this email.</p>
      <p style="color:#666;font-size:12px">— iCover</p>
    `,
  });
}

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

// Step 1: collect email+password, send an OTP, write a pending row.
// No user account is created yet — that happens after the OTP succeeds.
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

    const passwordHash = await hashPassword(password);
    const otp = generateOtp();
    const otpHash = hashToken(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    // UPSERT — if the user retried signup before verifying, replace the row.
    await pool.query(
      `INSERT INTO email_verifications (email, password_hash, otp_hash, expires_at, attempts, last_sent_at)
       VALUES (?, ?, ?, ?, 0, NOW())
       ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         otp_hash      = VALUES(otp_hash),
         expires_at    = VALUES(expires_at),
         attempts      = 0,
         last_sent_at  = NOW()`,
      [normalised, passwordHash, otpHash, expiresAt]
    );

    try {
      await sendOtpEmail(normalised, otp);
    } catch (err) {
      console.error("OTP email send failed:", err);
      return res.status(502).json({ error: "Couldn't send the verification email. Please try again." });
    }

    res.json({ pending: true, email: normalised });
  }
);

// Step 2: user submits the 6-digit OTP. On success we create the real user,
// log them in, and delete the pending row.
router.post("/auth/verify-otp",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 20, key: "verify-otp" }),
  async (req, res) => {
    const { email, otp } = req.body || {};
    if (typeof email !== "string" || typeof otp !== "string" || !/^\d{6}$/.test(otp.trim())) {
      return res.status(400).json({ error: "Invalid request." });
    }
    const normalised = email.trim().toLowerCase();

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query(
        `SELECT id, password_hash, otp_hash, expires_at, attempts
           FROM email_verifications
          WHERE email = ?
          FOR UPDATE`,
        [normalised]
      );
      if (!rows.length) {
        await conn.rollback();
        return res.status(400).json({ error: "No pending verification — please sign up again." });
      }
      const v = rows[0];

      if (new Date(v.expires_at).getTime() < Date.now()) {
        await conn.query("DELETE FROM email_verifications WHERE id = ?", [v.id]);
        await conn.commit();
        return res.status(400).json({ error: "Code expired — please request a new one." });
      }

      if (v.attempts >= OTP_MAX_ATTEMPTS) {
        await conn.query("DELETE FROM email_verifications WHERE id = ?", [v.id]);
        await conn.commit();
        return res.status(429).json({ error: "Too many wrong attempts — please sign up again." });
      }

      if (v.otp_hash !== hashToken(otp.trim())) {
        await conn.query("UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?", [v.id]);
        await conn.commit();
        const remaining = OTP_MAX_ATTEMPTS - (v.attempts + 1);
        return res.status(400).json({
          error: remaining > 0
            ? `Wrong code. ${remaining} ${remaining === 1 ? "attempt" : "attempts"} remaining.`
            : "Wrong code. No attempts remaining — please sign up again.",
        });
      }

      // Correct OTP. Create the user, log them in.
      const [insert] = await conn.query(
        "INSERT INTO users (email, password_hash, plan, email_verified_at) VALUES (?, ?, 'none', NOW())",
        [normalised, v.password_hash]
      );
      await conn.query("DELETE FROM email_verifications WHERE id = ?", [v.id]);
      await conn.commit();

      const user = { id: insert.insertId, email: normalised, plan: "none" };
      setSessionCookie(res, signSession(user));
      res.json({ user });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
);

router.post("/auth/resend-otp",
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, key: "resend-otp" }),
  async (req, res) => {
    const { email } = req.body || {};
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Invalid email." });
    }
    const normalised = email.trim().toLowerCase();

    const [rows] = await pool.query(
      "SELECT id, last_sent_at FROM email_verifications WHERE email = ?",
      [normalised]
    );
    if (!rows.length) {
      // Don't reveal whether a pending signup exists.
      return res.json({ ok: true });
    }
    const v = rows[0];

    const sinceLast = (Date.now() - new Date(v.last_sent_at).getTime()) / 1000;
    if (sinceLast < OTP_RESEND_COOLDOWN_S) {
      return res.status(429).json({
        error: `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_S - sinceLast)}s before requesting another code.`,
      });
    }

    const otp = generateOtp();
    const otpHash = hashToken(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    await pool.query(
      `UPDATE email_verifications
         SET otp_hash = ?, expires_at = ?, attempts = 0, last_sent_at = NOW()
       WHERE id = ?`,
      [otpHash, expiresAt, v.id]
    );

    try {
      await sendOtpEmail(normalised, otp);
    } catch (err) {
      console.error("OTP resend failed:", err);
      return res.status(502).json({ error: "Couldn't send the verification email." });
    }

    res.json({ ok: true });
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
  const { id, email, plan, created_at, email_verified_at } = req.user;
  res.json({
    user: {
      id,
      email,
      plan,
      created_at,
      emailVerified: !!email_verified_at,
    },
  });
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
