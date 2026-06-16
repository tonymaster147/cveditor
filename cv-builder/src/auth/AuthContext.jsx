import { createContext, useCallback, useContext, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const AuthContext = createContext({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
  verifyOtp: async () => {},
  resendOtp: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
      const data = await r.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Returns either { user }  → account exists and we're logged in,
  //         or     { pending: true, email } → OTP sent, frontend should
  //                navigate to the verification page.
  const signup = useCallback(async (email, password) => {
    const r = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Sign up failed");
    if (data.pending) return { pending: true, email: data.email };
    setUser(data.user);
    return { user: data.user };
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    const r = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Verification failed");
    setUser(data.user);
    return data.user;
  }, []);

  const resendOtp = useCallback(async (email) => {
    const r = await fetch(`${API_BASE}/api/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Couldn't resend code");
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, refresh, verifyOtp, resendOtp }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
