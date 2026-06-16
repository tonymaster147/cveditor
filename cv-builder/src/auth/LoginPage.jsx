import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AuthCard, { FormField, SubmitButton, ErrorBox } from "./AuthCard";

// Same priority as SignupPage: router state.from > sessionStorage > /dashboard.
function popPostAuthRedirect(stateFrom) {
  if (stateFrom) return stateFrom;
  const stashed = sessionStorage.getItem("cv_after_auth_redirect");
  if (stashed) {
    sessionStorage.removeItem("cv_after_auth_redirect");
    return stashed;
  }
  return "/dashboard";
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(popPostAuthRedirect(state?.from), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to access your dashboard."
      footer={<>Don't have an account? <Link to="/signup" state={state} className="font-semibold text-amber-600 hover:underline">Sign up</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <ErrorBox>{error}</ErrorBox>
        <SubmitButton loading={loading}>Log in</SubmitButton>
        <div className="text-right text-xs">
          <Link to="/forgot-password" className="text-gray-600 hover:text-gray-900">Forgot your password?</Link>
        </div>
      </form>
    </AuthCard>
  );
}
