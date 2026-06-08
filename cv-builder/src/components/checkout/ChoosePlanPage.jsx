import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEMPLATES } from "../../templates/registry";
import CheckoutLayout from "./CheckoutLayout";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function formatPrice(cents, currency) {
  if (currency === "gbp") return `£${(cents / 100).toFixed(2)}`;
  return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

const BENEFITS = [
  { icon: "📄", title: "Download as PDF and DOCX", body: "Both formats included with every purchase." },
  { icon: "✨", title: "No watermark, no branding", body: "Your CV is yours — clean, professional, ready to send." },
  { icon: "✏️", title: "Re-edit any time", body: "Open this CV again in the editor and make changes for free." },
  { icon: "🔒", title: "Private and secure", body: "We don't store your CV content. Payment processed by Stripe." },
  { icon: "⚡", title: "Instant download", body: "File is generated and downloaded the moment your payment succeeds." },
  { icon: "💷", title: "One-time payment", body: "No subscription, no auto-renewal, no surprise charges." },
];

export default function ChoosePlanPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find((t) => t.id === templateId);

  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!template) {
      navigate("/", { replace: true });
      return;
    }
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/templates/${templateId}`);
        if (!r.ok) throw new Error("Could not load template price");
        setPrice(await r.json());
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [templateId, template, navigate]);

  if (!template) return null;

  return (
    <CheckoutLayout activeStep={2} onClose={() => navigate(`/edit/${templateId}`)}>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">You're one step from your finished CV</h1>
      <p className="text-center text-gray-600 mb-8">Unlock instant download for the <span className="font-semibold">{template.name}</span> template.</p>

      <div className="grid md:grid-cols-[1fr,1.2fr] gap-6">
        {/* Left: plan card */}
        <div>
          <div className="border-2 border-emerald-500 rounded-lg p-6 bg-white shadow-sm relative">
            <span className="absolute -top-3 left-6 bg-emerald-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
              ONE-TIME PURCHASE
            </span>
            <div className="text-lg font-semibold">{template.name} CV</div>
            <div className="text-xs text-gray-500 mb-4">{template.tagline}</div>

            <div className="text-4xl font-bold text-gray-900 mb-1">
              {price ? formatPrice(price.price_cents, price.currency) : "—"}
            </div>
            <div className="text-xs text-gray-500 mb-6">One-time payment, no subscription.</div>

            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Download as PDF and DOCX</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> No watermark</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Re-download any time from this browser</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Secure payment via Stripe</li>
            </ul>

            {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

            <button
              disabled={!price}
              onClick={() => navigate(`/checkout/${templateId}/payment`)}
              className="w-full py-3 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base disabled:opacity-50"
            >
              Continue to payment
            </button>

            <button
              onClick={() => navigate(`/edit/${templateId}`)}
              className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              ← Back to editor
            </button>
          </div>
        </div>

        {/* Right: benefits */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">What you're getting</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-3">
                <div className="text-2xl flex-shrink-0">{b.icon}</div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{b.title}</div>
                  <div className="text-xs text-gray-600">{b.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}
