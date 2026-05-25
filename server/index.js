import "dotenv/config";
import express from "express";
import cors from "cors";

import templatesRoute from "./routes/templates.js";
import paymentRoute from "./routes/payment.js";
import webhookRoute from "./routes/webhook.js";
import downloadRoute from "./routes/download.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));

// Stripe webhook MUST receive the raw body for signature verification.
// Mount it BEFORE the JSON parser, on its own path.
app.use("/api/stripe-webhook", express.raw({ type: "application/json" }), webhookRoute);

// JSON parser for all other routes.
app.use(express.json());

app.use("/api", templatesRoute);
app.use("/api", paymentRoute);
app.use("/api", downloadRoute);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
