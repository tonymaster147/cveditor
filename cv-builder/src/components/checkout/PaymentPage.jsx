import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { TEMPLATES } from "../../templates/registry";
import CheckoutLayout from "./CheckoutLayout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

// Cache PaymentIntent promises by templateId. Without this React StrictMode's
// double-invoked effects (dev) — and even ordinary back/forward navigation —
// would create two PaymentIntents per checkout. Reusing the in-flight promise
// gives us "create at most once per templateId per session".
const intentCache = new Map();
function getOrCreateIntent(templateId) {
  const existing = intentCache.get(templateId);
  if (existing) return existing;
  const promise = fetch(`${API_BASE}/api/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId }),
  })
    .then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed to start payment");
      return data;
    })
    .catch((err) => {
      // Don't poison the cache with a rejected promise — let the next call retry.
      intentCache.delete(templateId);
      throw err;
    });
  intentCache.set(templateId, promise);
  return promise;
}

function formatPrice(cents, currency) {
  if (currency === "gbp") return `£${(cents / 100).toFixed(2)}`;
  return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

function PaymentForm({ templateId, paymentIntentId, amountCents, currency, templateName }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [step, setStep] = useState(1); // 1 = details, 2 = card
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  const priceLabel = formatPrice(amountCents, currency);

  const handleContinue = async () => {
    if (!elements) return;
    setError(null);
    setSubmitting(true);

    const addressEl = elements.getElement(AddressElement);
    const { complete, value } = await addressEl.getValue();
    if (!complete) {
      setError("Please fill in all required address fields.");
      setSubmitting(false);
      return;
    }
    if (!value?.name || value.name.trim().length < 2) {
      setError("Please enter your full name.");
      setSubmitting(false);
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    // Persist the customer details server-side now, so we have them even if the user abandons
    // before submitting the card.
    try {
      await fetch(`${API_BASE}/api/save-customer-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          email,
          name: value.name,
          phone: value.phone || null,
          address: value.address,
        }),
      });
    } catch {
      // Non-fatal — we'll still try to save again on payment confirm.
    }

    setSubmitting(false);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const addressEl = elements.getElement(AddressElement);
    const { value: addr } = await addressEl.getValue();

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        receipt_email: email || undefined,
        payment_method_data: {
          billing_details: {
            name: addr?.name,
            email: email || undefined,
            phone: addr?.phone,
            address: addr?.address,
          },
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setSubmitting(false);
      return;
    }

    // Poll for webhook-issued token (max ~5s in dev — webhooks usually arrive in <1s).
    let token = null;
    for (let i = 0; i < 10; i++) {
      const r = await fetch(`${API_BASE}/api/payment-status/${paymentIntentId}`);
      const data = await r.json();
      if (data.status === "succeeded" && data.downloadToken) {
        token = data.downloadToken;
        break;
      }
      if (data.status === "failed") {
        setError("Payment failed.");
        setSubmitting(false);
        return;
      }
      await new Promise((res) => setTimeout(res, 500));
    }

    // Webhook hasn't arrived (or isn't configured in dev). Fall back to server-side verification.
    if (!token) {
      const confirmRes = await fetch(`${API_BASE}/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });
      const confirmData = await confirmRes.json();
      if (confirmRes.ok && confirmData.status === "succeeded" && confirmData.downloadToken) {
        token = confirmData.downloadToken;
      }
    }

    if (!token) {
      setError("Payment succeeded but we couldn't unlock the download. Please contact support with reference: " + paymentIntentId);
      setSubmitting(false);
      return;
    }

    const redeem = await fetch(`${API_BASE}/api/redeem-download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!redeem.ok) {
      const d = await redeem.json().catch(() => ({}));
      setError(d.error || "Could not unlock download.");
      setSubmitting(false);
      return;
    }

    sessionStorage.setItem("cv_paid_template", templateId);
    sessionStorage.setItem("cv_paid_payment_id", paymentIntentId);
    sessionStorage.setItem("cv_paid_token", token);
    intentCache.delete(templateId); // prevent reusing the now-consumed PaymentIntent
    setSubmitting(false);
    navigate(`/checkout/${templateId}/done`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 1 — details (kept mounted, hidden when on step 2) */}
      <div style={{ display: step === 1 ? "block" : "none" }} className="space-y-4">
        <h2 className="text-lg font-semibold">Your details</h2>
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value?.email || "")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Billing address</label>
          <AddressElement options={{ mode: "billing", fields: { phone: "auto" } }} />
        </div>
      </div>

      {/* Step 2 — card */}
      <div style={{ display: step === 2 ? "block" : "none" }} className="space-y-4">
        <h2 className="text-lg font-semibold">Payment</h2>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Card details</label>
          <PaymentElement options={{ fields: { billingDetails: "never" } }} />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex justify-between gap-2 pt-2">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => navigate(`/checkout/${templateId}`)}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
            disabled={submitting}
          >
            ← Back
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setError(null); setStep(1); }}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
            disabled={submitting}
          >
            ← Back
          </button>
        )}

        {step === 1 ? (
          <button
            type="button"
            onClick={handleContinue}
            disabled={!elements || submitting}
            className="px-5 py-2 text-sm rounded bg-gray-900 hover:bg-black text-white font-semibold disabled:opacity-50"
          >
            {submitting ? "Checking…" : "Continue →"}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!stripe || submitting}
            className="px-5 py-2 text-sm rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold disabled:opacity-50"
          >
            {submitting ? "Processing…" : `Pay ${priceLabel}`}
          </button>
        )}
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find((t) => t.id === templateId);
  const [intent, setIntent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!template) {
      navigate("/", { replace: true });
      return;
    }
    let cancelled = false;
    getOrCreateIntent(templateId)
      .then((data) => { if (!cancelled) setIntent(data); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [templateId, template, navigate]);

  if (!template) return null;

  return (
    <CheckoutLayout activeStep={3} onClose={() => navigate(`/edit/${templateId}`)}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Complete your purchase</h1>
        <p className="text-sm text-gray-600 mb-6">
          {template.name} CV
          {intent && <> — <span className="font-semibold">{formatPrice(intent.amountCents, intent.currency)}</span></>}
        </p>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          {!intent && !error && (
            <div className="text-sm text-gray-500 py-8 text-center">Loading payment form…</div>
          )}
          {intent && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: intent.clientSecret, appearance: { theme: "stripe" } }}
            >
              <PaymentForm
                templateId={templateId}
                paymentIntentId={intent.paymentIntentId}
                amountCents={intent.amountCents}
                currency={intent.currency}
                templateName={intent.templateName}
              />
            </Elements>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          🔒 Payments are processed securely by Stripe. We never see your card details.
        </p>
      </div>
    </CheckoutLayout>
  );
}
