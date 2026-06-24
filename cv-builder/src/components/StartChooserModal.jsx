import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const PARSE_PROGRESS_MESSAGES = [
  "Reading your CV…",
  "Extracting contact details…",
  "Finding your experience…",
  "Matching the template…",
  "Almost done…",
];

export default function StartChooserModal({ template, onClose }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [phase, setPhase] = useState("choose"); // choose | parsing | error
  const [progressMsg, setProgressMsg] = useState(PARSE_PROGRESS_MESSAGES[0]);
  const [error, setError] = useState(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && phase !== "parsing") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onClose]);

  // Rotating progress messages while parsing
  useEffect(() => {
    if (phase !== "parsing") return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PARSE_PROGRESS_MESSAGES.length;
      setProgressMsg(PARSE_PROGRESS_MESSAGES[i]);
    }, 1500);
    return () => clearInterval(id);
  }, [phase]);

  const startBlank = () => {
    sessionStorage.removeItem("cv_seed_data");
    sessionStorage.removeItem("cv_seed_template");
    navigate(`/edit/${template.id}`);
  };

  const pickFile = () => fileInputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side guard before upload.
    const okMime = file.type === "application/pdf"
      || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const okExt = /\.(pdf|docx)$/i.test(file.name);
    if (!okMime && !okExt) {
      setError("Please upload a PDF or DOCX file.");
      setPhase("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum 5 MB.");
      setPhase("error");
      return;
    }

    setError(null);
    setPhase("parsing");
    setProgressMsg(PARSE_PROGRESS_MESSAGES[0]);

    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch(`${API_BASE}/api/parse-cv`, {
        method: "POST",
        body: form,
      });
      const result = await r.json();
      if (!r.ok || !result.ok) {
        throw new Error(result.error || "Couldn't parse that file.");
      }
      sessionStorage.setItem("cv_seed_data", JSON.stringify(result.data));
      sessionStorage.setItem("cv_seed_template", template.id);
      navigate(`/edit/${template.id}`);
    } catch (err) {
      setError(err.message);
      setPhase("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={() => phase !== "parsing" && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {phase === "choose" && (
          <>
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  How would you like to start?
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Using the <span className="font-semibold">{template.name}</span> template
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-2xl text-gray-400 hover:text-gray-700 leading-none -mt-1"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {/* Upload card */}
              <button
                type="button"
                onClick={pickFile}
                className="group text-left bg-white border-2 border-gray-200 hover:border-amber-500 hover:shadow-md rounded-xl p-5 transition"
              >
                <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                  ⬆
                </div>
                <div className="mt-3 text-base font-bold text-gray-900">Upload your CV</div>
                <div className="text-xs text-gray-600 mt-1">
                  Drop in a PDF or DOCX — we'll pre-fill the editor with what we can extract.
                </div>
                <div className="text-[11px] text-gray-400 mt-2">PDF or DOCX · max 5 MB</div>
              </button>

              {/* Start blank card */}
              <button
                type="button"
                onClick={startBlank}
                className="group text-left bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl p-5 transition"
              >
                <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xl">
                  ✎
                </div>
                <div className="mt-3 text-base font-bold text-gray-900">Start blank</div>
                <div className="text-xs text-gray-600 mt-1">
                  Open the editor with sample text. Click any line to replace it with your own.
                </div>
                <div className="text-[11px] text-gray-400 mt-2">Fastest if you're writing from scratch</div>
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-5 text-center">
              Uploaded files are only used to extract text. They aren't stored on our servers.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFile}
            />
          </>
        )}

        {phase === "parsing" && (
          <div className="py-10 text-center">
            <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="mt-5 text-lg font-semibold text-gray-900">Parsing your CV…</div>
            <div className="mt-1 text-sm text-gray-500">{progressMsg}</div>
            <p className="mt-6 text-xs text-gray-500 max-w-md mx-auto">
              This usually takes a few seconds. We don't always get every field right —
              you'll be able to review and edit on the next screen.
            </p>
          </div>
        )}

        {phase === "error" && (
          <div className="py-6">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Couldn't read that file
              </h2>
              <button
                onClick={onClose}
                className="text-2xl text-gray-400 hover:text-gray-700 leading-none -mt-1"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Try a different file, or start blank and type your CV in directly.
            </p>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setError(null); setPhase("choose"); }}
                className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={startBlank}
                className="px-5 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                Start blank instead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
