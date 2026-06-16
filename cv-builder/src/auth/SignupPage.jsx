import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AuthCard, { FormField, SubmitButton, ErrorBox } from "./AuthCard";

// Where to send the user after a successful signup. Priority:
//   1. router state.from (set by ProtectedRoute or explicit Link navigations)
//   2. sessionStorage 'cv_after_auth_redirect' (set by ChoosePlanPage when
//      a logged-out user picks the lifetime plan)
//   3. fallback /dashboard
function popPostAuthRedirect(stateFrom) {
  if (stateFrom) return stateFrom;
  const stashed = sessionStorage.getItem("cv_after_auth_redirect");
  if (stashed) {
    sessionStorage.removeItem("cv_after_auth_redirect");
    return stashed;
  }
  return "/dashboard";
}

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // If the caller passed router state.from (e.g. via Link state), promote it
      // into sessionStorage so the verify page can read it after OTP succeeds.
      if (state?.from && !sessionStorage.getItem("cv_after_auth_redirect")) {
        sessionStorage.setItem("cv_after_auth_redirect", state.from);
      }
      const result = await signup(email, password);
      if (result.pending) {
        navigate(`/verify-email?email=${encodeURIComponent(result.email)}`, { replace: true });
        return;
      }
      navigate(popPostAuthRedirect(state?.from), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="No email verification needed. You can reset your password any time."
      footer={<>Already have an account? <Link to="/login" state={state} className="font-semibold text-amber-600 hover:underline">Log in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Password (8+ characters)" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <FormField label="Confirm password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <ErrorBox>{error}</ErrorBox>
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthCard>
  );
}
