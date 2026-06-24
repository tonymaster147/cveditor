import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { attachUser } from "./auth.js";
import templatesRoute from "./routes/templates.js";
import paymentRoute from "./routes/payment.js";
import webhookRoute from "./routes/webhook.js";
import downloadRoute from "./routes/download.js";
import emailRoute from "./routes/email.js";
import authRoute from "./routes/auth.js";
import parseCvRoute from "./routes/parseCv.js";

const app = express();

// Comma-separated list of allowed browser origins.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    // No origin (curl, server-to-server, same-origin) is allowed.
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // Disallow: tell cors to skip CORS headers, browser will block.
    cb(null, false);
  },
  // Session cookies are httpOnly + cross-origin → browser sends them only
  // when the response set Access-Control-Allow-Credentials: true.
  credentials: true,
}));

// Stripe webhook MUST receive the raw body for signature verification.
// Mount it BEFORE the JSON parser, on its own path.
app.use("/api/stripe-webhook", express.raw({ type: "application/json" }), webhookRoute);

// JSON parser for all other routes. 25 MB cap accommodates email-receipt's
// base64-encoded file upload — multi-page PDFs at 2x scale can hit 15 MB+
// after base64 expansion. Per-route size guards live inside the routes.
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(attachUser);

app.use("/api", authRoute);
app.use("/api", templatesRoute);
app.use("/api", paymentRoute);
app.use("/api", downloadRoute);
app.use("/api", emailRoute);
app.use("/api", parseCvRoute);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
