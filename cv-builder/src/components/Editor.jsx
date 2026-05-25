import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { initialData } from "../data/initialData";
import { setPath } from "../templates/helpers";
import { TEMPLATES } from "../templates/registry";
import logoUrl from "../assets/Icover-Org-Uk.webp";

const ACCENTS = ["#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b", "#0ea5e9", "#ec4899", "#111827", "#06b6d4", "#6366f1"];

export default function Editor() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const currentTemplate = TEMPLATES.find((t) => t.id === templateId);

  // Redirect to gallery if invalid template id
  useEffect(() => {
    if (!currentTemplate) navigate("/", { replace: true });
  }, [currentTemplate, navigate]);

  const [data, setData] = useState(initialData);
  const [accent, setAccent] = useState(currentTemplate?.defaultAccent || "#10b981");
  const [format, setFormat] = useState("pdf");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const PAGE_W = 794;
    const recompute = () => {
      const vw = window.innerWidth;
      if (vw >= 820) { setScale(1); return; }
      const padding = 16; // px breathing room on each side
      setScale(Math.min(1, (vw - padding * 2) / PAGE_W));
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  // When template changes via URL, reset accent to its default
  useEffect(() => {
    if (currentTemplate?.defaultAccent) setAccent(currentTemplate.defaultAccent);
  }, [templateId]); // eslint-disable-line

  const update = (path, value) => setData((d) => setPath(d, path, value));

  const handleDownload = () => {
    // Stash the editor state so the post-payment Thank You page can re-render
    // the CV and generate the file in the chosen format.
    try {
      sessionStorage.setItem("cv_state_data", JSON.stringify(data));
      sessionStorage.setItem("cv_state_accent", accent);
      sessionStorage.setItem("cv_state_format", format);
      sessionStorage.removeItem("cv_paid_template");
      sessionStorage.removeItem("cv_paid_payment_id");
    } catch {
      // sessionStorage full / disabled — proceed anyway; ThankYou will fall back to initialData.
    }
    navigate(`/checkout/${templateId}`);
  };

  if (!currentTemplate) return null;

  const Template = currentTemplate.component;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="iCover" className="h-8 w-auto" />
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              ← Templates
            </Link>
            <span className="text-gray-300">|</span>
            <span className="font-semibold">{currentTemplate.name}</span>
            <span className="text-xs text-gray-500 hidden md:inline">— click any text to edit</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 mr-1">Switch:</span>
              <select
                value={templateId}
                onChange={(e) => navigate(`/edit/${e.target.value}`)}
                className="text-xs border rounded px-2 py-1.5"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 mr-1">Color:</span>
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    accent === c ? "border-gray-900 scale-110" : "border-white"
                  }`}
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="text-xs border rounded px-2 py-1.5 bg-white"
                title="Download format"
              >
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"
              >
                ⬇ Download {format.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 overflow-x-hidden">
        <div className="cv-page-scaler-outer" style={{ "--cv-scale": scale }}>
          <div className="cv-page-scaler" style={{ "--cv-scale": scale }}>
            <Template data={data} update={update} accent={accent} />
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-3">
        © Copyright 2026 iCover
      </footer>

    </div>
  );
}
