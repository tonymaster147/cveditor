import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Gallery from "./components/Gallery.jsx";
import Editor from "./components/Editor.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import BackToTopButton from "./components/BackToTopButton.jsx";
import ChoosePlanPage from "./components/checkout/ChoosePlanPage.jsx";
import PaymentPage from "./components/checkout/PaymentPage.jsx";
import ThankYouPage from "./components/checkout/ThankYouPage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import LoginPage from "./auth/LoginPage.jsx";
import SignupPage from "./auth/SignupPage.jsx";
import VerifyEmailPage from "./auth/VerifyEmailPage.jsx";
import ForgotPasswordPage from "./auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./auth/ResetPasswordPage.jsx";
import DashboardPage from "./auth/DashboardPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/cv-editor">
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/edit/:templateId" element={<Editor />} />
          <Route path="/checkout/:templateId" element={<ChoosePlanPage />} />
          <Route path="/checkout/:templateId/payment" element={<PaymentPage />} />
          <Route path="/checkout/:templateId/done" element={<ThankYouPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BackToTopButton />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
