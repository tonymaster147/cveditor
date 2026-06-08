import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Gallery from "./components/Gallery.jsx";
import Editor from "./components/Editor.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ChoosePlanPage from "./components/checkout/ChoosePlanPage.jsx";
import PaymentPage from "./components/checkout/PaymentPage.jsx";
import ThankYouPage from "./components/checkout/ThankYouPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/cv-editor">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/edit/:templateId" element={<Editor />} />
        <Route path="/checkout/:templateId" element={<ChoosePlanPage />} />
        <Route path="/checkout/:templateId/payment" element={<PaymentPage />} />
        <Route path="/checkout/:templateId/done" element={<ThankYouPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
