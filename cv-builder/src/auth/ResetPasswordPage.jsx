import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AuthCard, { FormField, SubmitButton, ErrorBox } from "./AuthCard";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        subtitle="This page needs a valid reset token. Request a fresh email."
        footer={<><Link to="/forgot-password" className="font-semibold text-amber-600 hover:underline">Send a new reset link</Link></>}
      >
        <p className="text-sm text-gray-700">If you got here by clicking an email link, the link may be incomplete. Try copy-pasting the full URL into your browser.</p>
      </AuthCard>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not reset password");
      navigate("/login", { replace: true, state: { resetSuccess: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password you'll remember."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="New password (8+ characters)" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <FormField label="Confirm new password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <ErrorBox>{error}</ErrorBox>
        <SubmitButton loading={loading}>Save new password</SubmitButton>
      </form>
    </AuthCard>
  );
}
