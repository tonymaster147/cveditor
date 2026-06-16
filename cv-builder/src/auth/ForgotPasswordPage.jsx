import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard, { FormField, SubmitButton, ErrorBox } from "./AuthCard";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Couldn't send the reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard
        title="Check your inbox"
        subtitle="If an account exists for that email, we've sent a reset link. It's valid for 1 hour."
        footer={<><Link to="/login" className="font-semibold text-amber-600 hover:underline">Back to login</Link></>}
      >
        <p className="text-sm text-gray-700">Didn't receive an email? Check your spam folder or try again in a few minutes.</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter the email you signed up with — we'll email you a link."
      footer={<><Link to="/login" className="font-semibold text-amber-600 hover:underline">Back to login</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <ErrorBox>{error}</ErrorBox>
        <SubmitButton loading={loading}>Send reset link</SubmitButton>
      </form>
    </AuthCard>
  );
}
