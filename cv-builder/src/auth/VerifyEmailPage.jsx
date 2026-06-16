import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AuthCard, { SubmitButton, ErrorBox } from "./AuthCard";

// Pops a stashed post-auth redirect (same logic as Login/Signup).
function popPostAuthRedirect() {
  const stashed = sessionStorage.getItem("cv_after_auth_redirect");
  if (stashed) {
    sessionStorage.removeItem("cv_after_auth_redirect");
    return stashed;
  }
  return "/dashboard";
}

const RESEND_COOLDOWN_S = 60;

export default function VerifyEmailPage() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const tickRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    tickRef.current = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(tickRef.current);
  }, [cooldown]);

  if (!email) {
    return (
      <AuthCard
        title="Missing email"
        subtitle="This page needs an email parameter. Please sign up again."
        footer={<><Link to="/signup" className="font-semibold text-amber-600 hover:underline">Back to sign up</Link></>}
      />
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const trimmed = otp.replace(/\s/g, "");
    if (!/^\d{6}$/.test(trimmed)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(email, trimmed);
      navigate(popPostAuthRedirect(), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    try {
      await resendOtp(email);
      setInfo("A fresh code has been sent. Check your inbox (and spam folder).");
      setCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle={<>We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>. Enter it below to finish signing up.</>}
      footer={<><Link to="/signup" className="font-semibold text-amber-600 hover:underline">Use a different email</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-gray-700">6-digit code</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="mt-1 w-full px-3 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-lg tracking-widest text-center font-semibold"
            required
          />
        </label>

        <ErrorBox>{error}</ErrorBox>
        {info && (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {info}
          </div>
        )}

        <SubmitButton loading={loading}>Verify and sign in</SubmitButton>

        <div className="text-center text-xs text-gray-600">
          Didn't receive it?{" "}
          {cooldown > 0 ? (
            <span className="text-gray-400">Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              className="text-amber-600 hover:underline font-semibold"
            >
              Resend code
            </button>
          )}
        </div>
      </form>
    </AuthCard>
  );
}
