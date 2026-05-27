import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { asBlob } from "html-docx-js-typescript";
import { TEMPLATES } from "../../templates/registry";
import { initialData } from "../../data/initialData";
import CheckoutLayout from "./CheckoutLayout";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ThankYouPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find((t) => t.id === templateId);

  const pageRef = useRef(null);
  const emailSentRef = useRef(false);
  const [status, setStatus] = useState("preparing"); // preparing | downloaded | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [emailStatus, setEmailStatus] = useState("idle"); // idle | sending | sent | failed
  const [emailedTo, setEmailedTo] = useState(null);

  // Read CV state stashed by the editor before checkout.
  const paid = sessionStorage.getItem("cv_paid_template") === templateId;
  const dataJson = sessionStorage.getItem("cv_state_data");
  const accent = sessionStorage.getItem("cv_state_accent") || template?.defaultAccent || "#10b981";
  const format = sessionStorage.getItem("cv_state_format") || "pdf";
  const data = dataJson ? JSON.parse(dataJson) : initialData;

  useEffect(() => {
    if (!template) {
      navigate("/", { replace: true });
      return;
    }
    if (!paid) {
      // Guard: refuse to render thank-you if the user landed here without a payment marker.
      navigate(`/checkout/${templateId}`, { replace: true });
      return;
    }
  }, [template, paid, templateId, navigate]);

  const generateBlob = async () => {
    const node = pageRef.current?.querySelector(".cv-page");
    if (!node) throw new Error("Template not rendered");

    const baseName = (data.name || "resume").replace(/\s+/g, "_");

    if (format === "docx") {
      const clone = node.cloneNode(true);
      clone.querySelectorAll(".no-export").forEach((el) => el.remove());
      clone.querySelectorAll("li > span.shrink-0").forEach((el) => {
        if ((el.textContent || "").trim() === "•") el.remove();
      });
      clone.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));

      let cssText = "";
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (!rules) continue;
          for (const rule of rules) cssText += rule.cssText + "\n";
        } catch { /* cross-origin */ }
      }
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${cssText}
        body { margin: 0; } .cv-page { width: 794px; }
      </style></head><body>${clone.outerHTML}</body></html>`;
      const blob = await asBlob(html);
      return {
        blob,
        filename: `${baseName}.docx`,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }

    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    // JPEG at 0.85 quality keeps a CV visually crisp while shrinking the PDF
    // from ~14 MB (PNG) to ~2 MB. Email-friendly; still print-quality.
    const imgData = canvas.toDataURL("image/jpeg", 0.85);
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    const EPS = 1;
    if (imgH <= pageH + EPS) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH);
    } else {
      let position = 0;
      let remaining = imgH;
      while (remaining > EPS) {
        pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
        remaining -= pageH;
        position -= pageH;
        if (remaining > EPS) pdf.addPage();
      }
    }
    return {
      blob: pdf.output("blob"),
      filename: `${baseName}.pdf`,
      contentType: "application/pdf",
    };
  };

  const sendEmailCopy = async (blob, filename, contentType) => {
    const token = sessionStorage.getItem("cv_paid_token");
    if (!token) return; // no token = no email (e.g. re-download via "Download again")
    setEmailStatus("sending");
    try {
      const fileBase64 = await blobToBase64(blob);
      const r = await fetch(`${API_BASE}/api/email-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, filename, contentType, fileBase64 }),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(out.error || "Email send failed");
      setEmailedTo(out.sentTo || null);
      setEmailStatus("sent");
      // One-shot: clear the token so subsequent "Download again" clicks don't re-email.
      sessionStorage.removeItem("cv_paid_token");
    } catch {
      setEmailStatus("failed");
    }
  };

  const runDownload = async () => {
    if (!pageRef.current) return;
    setStatus("preparing");
    setErrorMsg(null);
    try {
      const { blob, filename, contentType } = await generateBlob();
      triggerDownload(blob, filename);
      setStatus("downloaded");

      // Fire-and-forget the email copy on the FIRST successful download only.
      if (!emailSentRef.current) {
        emailSentRef.current = true;
        sendEmailCopy(blob, filename, contentType);
      }
    } catch (e) {
      setErrorMsg(e.message || "Could not generate the file.");
      setStatus("error");
    }
  };

  // Auto-trigger once when the offscreen render is in the DOM.
  useEffect(() => {
    if (!paid || !template) return;
    const t = setTimeout(runDownload, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [paid, template]);

  if (!template || !paid) return null;
  const Template = template.component;

  return (
    <CheckoutLayout activeStep={4} onClose={() => navigate("/")}>
      <div className="max-w-xl mx-auto text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">Payment successful — thank you!</h1>
        <p className="text-gray-600 mb-6">
          Your <span className="font-semibold">{template.name}</span> CV is ready.
        </p>

        <div className="bg-white rounded-lg border p-6 shadow-sm space-y-4">
          {status === "preparing" && (
            <div className="text-sm text-gray-600">⏳ Preparing your download…</div>
          )}
          {status === "downloaded" && (
            <div className="text-sm text-emerald-600">✓ Your {format.toUpperCase()} download has started. Check your browser's download bar.</div>
          )}
          {status === "error" && (
            <div className="text-sm text-red-600">{errorMsg}</div>
          )}

          {emailStatus === "sending" && (
            <div className="text-xs text-gray-500">📧 Emailing a copy…</div>
          )}
          {emailStatus === "sent" && (
            <div className="text-xs text-emerald-600">
              📧 A copy was emailed to {emailedTo || "your billing email"}.
            </div>
          )}
          {emailStatus === "failed" && (
            <div className="text-xs text-amber-600">
              ⚠ We couldn't email you a copy, but your download is still good.
            </div>
          )}

          <div className="flex gap-2 justify-center flex-wrap pt-2">
            <button
              onClick={runDownload}
              className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"
            >
              ⬇ Download again ({format.toUpperCase()})
            </button>
            <Link
              to={`/edit/${templateId}`}
              className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-50 text-sm font-semibold text-gray-700"
            >
              Back to editor
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact support.
        </p>
      </div>

      {/* Offscreen render of the CV for download generation. */}
      <div
        ref={pageRef}
        className="exporting"
        style={{ position: "fixed", left: "-99999px", top: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div className="cv-page-scaler-outer" style={{ "--cv-scale": 1 }}>
          <div className="cv-page-scaler" style={{ "--cv-scale": 1 }}>
            <Template data={data} update={() => {}} accent={accent} />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      // Strip the "data:<mime>;base64," prefix.
      const comma = dataUrl.indexOf(",");
      resolve(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
