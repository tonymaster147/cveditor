import logoUrl from "../assets/Icover-Org-Uk.webp";

// Shared shell for login/signup/forgot/reset pages.
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <a href="/cv-editor/" className="inline-flex items-center">
            <img src={logoUrl} alt="iCover" className="h-7 sm:h-9 w-auto" />
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && (
            <div className="text-center text-sm text-gray-600 mt-5">{footer}</div>
          )}
        </div>
      </main>
    </div>
  );
}

export function FormField({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
      />
    </label>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export function ErrorBox({ children }) {
  if (!children) return null;
  return (
    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      {children}
    </div>
  );
}
