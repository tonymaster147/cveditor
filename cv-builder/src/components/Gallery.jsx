import { Link } from "react-router-dom";
import { TEMPLATES } from "../templates/registry";
import { initialData } from "../data/initialData";
import logoUrl from "../assets/Icover-Org-Uk.webp";

const PAGE_W = 794;
const PAGE_H = 1123;
const THUMB_W = 360;             // visual width of the preview area
const SCALE = THUMB_W / PAGE_W;  // ~0.453
const THUMB_H = PAGE_H * SCALE;  // ~509

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoUrl} alt="iCover" className="h-9 w-auto" />
          </Link>
          <div className="text-sm text-gray-500">No sign-up · Free · No data stored</div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Pick a template. Edit live. Download PDF.
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Choose from professionally designed resume templates below. Customize colors,
          add a photo, edit text inline, and export a high-quality PDF — all in your browser.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-8">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-500 py-6 border-t bg-white">
        © Copyright 2026 iCover
      </footer>
    </div>
  );
}

function TemplateCard({ template }) {
  const Tmpl = template.component;
  return (
    <Link
      to={`/edit/${template.id}`}
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden text-left block"
      style={{ width: THUMB_W }}
    >
      <div
        className="thumb relative bg-gray-100 overflow-hidden"
        style={{ width: THUMB_W, height: THUMB_H }}
      >
        <div
          className="pointer-events-none absolute top-0 left-0"
          style={{
            width: PAGE_W,
            height: PAGE_H,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <Tmpl
            data={initialData}
            update={() => {}}
            accent={template.defaultAccent}
            isThumbnail
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
          {template.hasPhoto && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">PHOTO</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{template.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: template.defaultAccent }}>
            Use this template →
          </span>
          <span
            className="w-5 h-5 rounded-full border-2 border-white shadow"
            style={{ background: template.defaultAccent }}
          />
        </div>
      </div>
    </Link>
  );
}
