import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "./db.js";

const COOKIE_NAME = "cv_session";
const SESSION_TTL_DAYS = 30;
const BCRYPT_COST = 10;

const TOKEN_SECRET = process.env.TOKEN_SECRET;
if (!TOKEN_SECRET) {
  throw new Error("TOKEN_SECRET is required for auth");
}

// True in production (HTTPS), false on http://localhost.
const IS_PROD = (process.env.NODE_ENV || "").toLowerCase() === "production"
  || /^https:\/\//i.test(process.env.FRONTEND_ORIGIN || "");

export const SESSION_COOKIE = COOKIE_NAME;

export function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_COST);
}
export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signSession(user) {
  return jwt.sign(
    { uid: user.id, email: user.email },
    TOKEN_SECRET,
    { expiresIn: `${SESSION_TTL_DAYS}d` }
  );
}
export function verifySession(token) {
  try { return jwt.verify(token, TOKEN_SECRET); }
  catch { return null; }
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? "none" : "lax",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });
}
export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? "none" : "lax",
    path: "/",
  });
}

// Express middleware: populates req.user from the session cookie if present
// and the user still exists. Never throws — `req.user` is just `null` for
// unauthenticated requests, and downstream routes choose whether to require it.
export async function attachUser(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) { req.user = null; return next(); }
  const claims = verifySession(token);
  if (!claims?.uid) { req.user = null; return next(); }
  const [rows] = await pool.query(
    "SELECT id, email, plan, created_at, email_verified_at FROM users WHERE id = ?",
    [claims.uid]
  );
  req.user = rows[0] || null;
  next();
}

// Use on routes that require a logged-in user. Pair with attachUser first.
export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  next();
}

// Reset tokens are random 32-byte hex strings. We store only a SHA-256 of
// the token so a DB leak doesn't grant immediate reset ability — the
// attacker would still need to find the raw token in a user's email.
export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
export function hashToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// 6-digit OTP for email verification. Hashed before storage for the same
// reason as reset tokens.
export function generateOtp() {
  // Pad to 6 digits so values like 042938 don't render as 42938.
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

// Trivial in-memory rate limiter, keyed by IP+route. Resets every windowMs.
// Single-process only — fine for our single-container backend. If we ever
// horizontally scale, swap for Redis.
const rateBuckets = new Map();
export function rateLimit({ windowMs, max, key }) {
  return (req, res, next) => {
    const id = `${req.ip}::${key}`;
    const now = Date.now();
    const entry = rateBuckets.get(id);
    if (!entry || entry.resetAt < now) {
      rateBuckets.set(id, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      return res.status(429).json({ error: "Too many requests, try again later." });
    }
    entry.count++;
    next();
  };
}
