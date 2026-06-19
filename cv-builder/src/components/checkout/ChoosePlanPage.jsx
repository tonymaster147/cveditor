import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEMPLATES } from "../../templates/registry";
import { useAuth } from "../../auth/AuthContext";
import CheckoutLayout from "./CheckoutLayout";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function formatPrice(cents, currency) {
  if (currency === "gbp") return `£${(cents / 100).toFixed(2)}`;
  return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

export default function ChoosePlanPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const template = TEMPLATES.find((t) => t.id === templateId);

  const [oneTimePrice, setOneTimePrice] = useState(null);
  const [lifetimePrice, setLifetimePrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!template) {
      navigate("/", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [tplRes, ltRes] = await Promise.all([
          fetch(`${API_BASE}/api/templates/${templateId}`),
          fetch(`${API_BASE}/api/lifetime-plan`),
        ]);
        if (!tplRes.ok) throw new Error("Could not load template price");
        if (!ltRes.ok) throw new Error("Could not load lifetime price");
        if (!cancelled) {
          setOneTimePrice(await tplRes.json());
          setLifetimePrice(await ltRes.json());
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [templateId, template, navigate]);

  if (!template) return null;

  // Already lifetime? Skip the whole checkout — straight to thank-you.
  if (user?.plan === "lifetime") {
    return (
      <CheckoutLayout activeStep={2} onClose={() => navigate(`/edit/${templateId}`)}>
        <div className="max-w-xl mx-auto text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-bold">You have lifetime access</h1>
          <p className="text-gray-600 mt-3">No payment needed for the {template.name} template — go ahead and download.</p>
          <button
            onClick={() => navigate(`/checkout/${templateId}/done`)}
            className="mt-6 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold"
          >
            Continue to download
          </button>
        </div>
      </CheckoutLayout>
    );
  }

  const pickOneTime = () => {
    sessionStorage.setItem("cv_checkout_kind", "one_time");
    navigate(`/checkout/${templateId}/payment`);
  };

  const pickLifetime = () => {
    sessionStorage.setItem("cv_checkout_kind", "lifetime");
    if (!user) {
      // Need an account to track the lifetime plan. Stash the return path.
      sessionStorage.setItem("cv_after_auth_redirect", `/checkout/${templateId}/payment`);
      navigate("/signup");
      return;
    }
    navigate(`/checkout/${templateId}/payment`);
  };

  return (
    <CheckoutLayout activeStep={2} onClose={() => navigate(`/edit/${templateId}`)}>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 px-2">
        Choose your plan
      </h1>
      <p className="text-center text-gray-600 mb-8 sm:mb-10 px-4 text-sm sm:text-base">
        Download your finished CV now — or get lifetime access to every template.
      </p>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
        {/* One-time tile */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col">
          <div className="text-xs font-bold tracking-wider text-gray-500 mb-2">ONE-TIME</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Just this template</h2>
          <p className="mt-1 text-sm text-gray-600">
            Get the <span className="font-semibold">{template.name}</span> CV, ready to send.
          </p>
          <div className="mt-5 text-4xl font-extrabold text-gray-900">
            {oneTimePrice ? formatPrice(oneTimePrice.price_cents, oneTimePrice.currency) : "—"}
          </div>
          <div className="text-xs text-gray-500 mt-1">One-time payment</div>

          <ul className="mt-5 space-y-2 text-sm text-gray-700 flex-1">
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Download as polished PDF and editable DOCX</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> No watermark, ever</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Re-edit anytime in the editor</li>
            <li className="flex gap-2"><span className="text-emerald-500">✓</span> Re-download from this browser</li>
          </ul>

          <button
            disabled={!oneTimePrice}
            onClick={pickOneTime}
            className="mt-6 w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-50"
          >
            {oneTimePrice
              ? `Get this template — ${formatPrice(oneTimePrice.price_cents, oneTimePrice.currency)}`
              : "Get this template"}
          </button>
        </div>

        {/* Lifetime tile */}
        <div className="relative bg-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
          <div className="absolute -top-3 left-6 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
            Best value
          </div>
          <div className="text-xs font-bold tracking-wider text-amber-400 mb-2">LIFETIME</div>
          <h2 className="text-lg sm:text-xl font-bold">All templates, forever</h2>
          <p className="mt-1 text-sm text-gray-300">Every template, every format — yours for good.</p>
          <div className="mt-5 text-4xl font-extrabold">
            {lifetimePrice ? formatPrice(lifetimePrice.priceCents, lifetimePrice.currency) : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">One-time, never expires</div>

          <ul className="mt-5 space-y-2 text-sm text-gray-200 flex-1">
            <li className="flex gap-2"><span className="text-amber-400">★</span> Unlimited downloads of every CV template</li>
            <li className="flex gap-2"><span className="text-amber-400">★</span> PDF and DOCX, no watermarks</li>
            <li className="flex gap-2"><span className="text-amber-400">★</span> Account-based — log in from any device</li>
            <li className="flex gap-2"><span className="text-amber-400">★</span> All future templates included free</li>
          </ul>

          <button
            disabled={!lifetimePrice}
            onClick={pickLifetime}
            className="mt-6 w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-50"
          >
            {lifetimePrice
              ? `Get lifetime access — ${formatPrice(lifetimePrice.priceCents, lifetimePrice.currency)}`
              : "Get lifetime access"}
          </button>

          {!user && (
            <div className="mt-3 text-center text-xs text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  // User picked lifetime then clicked Log in — mirror what pickLifetime
                  // does so we return to the payment page in lifetime mode after login.
                  sessionStorage.setItem("cv_checkout_kind", "lifetime");
                  sessionStorage.setItem("cv_after_auth_redirect", `/checkout/${templateId}/payment`);
                  navigate("/login");
                }}
                className="text-amber-400 hover:underline font-semibold"
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate(`/edit/${templateId}`)}
        className="block mx-auto mt-8 text-xs text-gray-500 hover:text-gray-700"
      >
        ← Back to editor
      </button>
    </CheckoutLayout>
  );
}
