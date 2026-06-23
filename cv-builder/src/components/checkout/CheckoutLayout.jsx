import { Link } from "react-router-dom";
import logoUrl from "../../assets/Icover-Org-Uk.webp";

function StepBadge({ n, label, state }) {
  const base = "flex items-center gap-2";
  if (state === "done") {
    return (
      <div className={base}>
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-sm font-semibold">✓</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className={base}>
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-semibold">{n}</span>
        <span className="text-sm font-semibold text-gray-900">{label}</span>
      </div>
    );
  }
  return (
    <div className={base}>
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-sm font-semibold">{n}</span>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );
}

const STEPS = [
  { n: 1, label: "Create CV" },
  { n: 2, label: "Choose plan" },
  { n: 3, label: "Payment" },
  { n: 4, label: "Download" },
];

export default function CheckoutLayout({ activeStep, children, onClose }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center">
            <img src={logoUrl} alt="iCover" className="h-8 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-2xl">
            {STEPS.map((s, i) => {
              const state =
                activeStep > s.n ? "done" : activeStep === s.n ? "active" : "todo";
              return (
                <div key={s.n} className="flex items-center gap-4">
                  <StepBadge n={s.n} label={s.label} state={state} />
                  {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200" />}
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700 leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Mobile step indicator */}
        <div className="md:hidden border-t px-4 py-2 text-xs text-gray-600">
          Step {activeStep} of 4 — {STEPS[activeStep - 1]?.label}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
