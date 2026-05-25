import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  const [exporting, setExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const pageRef = useRef(null);

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

  const handleExport = async () => {
    if (!pageRef.current) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      const node = pageRef.current.querySelector(".cv-page");
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      const EPS = 1;
      if (imgH <= pageH + EPS) {
        pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
      } else {
        let position = 0;
        let remaining = imgH;
        while (remaining > EPS) {
          pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
          remaining -= pageH;
          position -= pageH;
          if (remaining > EPS) pdf.addPage();
        }
      }
      pdf.save(`${(data.name || "resume").replace(/\s+/g, "_")}.pdf`);
    } finally {
      setExporting(false);
    }
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

            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
            >
              {exporting ? "Generating…" : "⬇ Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 overflow-x-hidden">
        <div ref={pageRef} className={exporting ? "exporting" : ""}>
          <div className="cv-page-scaler-outer" style={{ "--cv-scale": scale }}>
            <div className="cv-page-scaler" style={{ "--cv-scale": scale }}>
              <Template data={data} update={update} accent={accent} />
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-3">
        © Copyright 2026 iCover
      </footer>
    </div>
  );
}
