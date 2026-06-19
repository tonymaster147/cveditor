import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logoUrl from "../assets/Icover-Org-Uk.webp";
import { FormField, SubmitButton, ErrorBox } from "./AuthCard";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/dashboard" }} />;
  }

  const planLabel = user.plan === "lifetime" ? "Lifetime — all templates" : "Free account";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <a href="/cv-editor/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logoUrl} alt="iCover" className="h-7 sm:h-9 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600">{user.email}</span>
            <button
              type="button"
              onClick={async () => { await logout(); navigate("/"); }}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back, {user.email}.</p>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Plan</div>
            <div className="mt-2 text-lg font-bold text-gray-900">{planLabel}</div>
            {user.plan === "none" && (
              <a href="/cv-editor/" className="mt-3 inline-block text-sm font-semibold text-amber-600 hover:underline">
                Browse templates →
              </a>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Account</div>
            <div className="mt-2 text-sm text-gray-700 break-all">{user.email}</div>
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="mt-3 text-sm font-semibold text-amber-600 hover:underline"
            >
              {showPwd ? "Cancel" : "Change password"}
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Member since</div>
            <div className="mt-2 text-sm text-gray-700">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </div>
          </div>
        </div>

        {showPwd && (
          <div className="mt-6 max-w-md">
            <ChangePasswordForm onDone={() => setShowPwd(false)} />
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Ready to build a CV?</h2>
          <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
            {user.plan === "lifetime"
              ? "Your lifetime plan covers unlimited downloads of any template."
              : "Pick a template from the home page to start editing."}
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition"
          >
            Browse templates →
          </Link>
        </div>
      </main>
    </div>
  );
}

function ChangePasswordForm({ onDone }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (next !== confirm) { setError("Passwords don't match."); return; }
    if (next.length < 8)  { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Couldn't change password");
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(onDone, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">Password updated.</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-white rounded-xl border border-gray-200 p-5">
      <FormField label="Current password" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
      <FormField label="New password (8+ characters)" type="password" autoComplete="new-password" minLength={8} required value={next} onChange={(e) => setNext(e.target.value)} />
      <FormField label="Confirm new password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <ErrorBox>{error}</ErrorBox>
      <SubmitButton loading={loading}>Update password</SubmitButton>
    </form>
  );
}

