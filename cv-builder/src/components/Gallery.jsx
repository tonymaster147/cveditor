import { useState } from "react";
import { Link } from "react-router-dom";
import { TEMPLATES } from "../templates/registry";
import { initialData } from "../data/initialData";
import { TESTIMONIALS } from "../data/testimonials";
import logoUrl from "../assets/Icover-Org-Uk.webp";

const PAGE_W = 794;
const PAGE_H = 1123;
const THUMB_W = 360;
const SCALE = THUMB_W / PAGE_W;
const THUMB_H = PAGE_H * SCALE;

const FEATURE_PILLS = ["No sign-up", "No data stored", "DOCX + PDF", "Instant download"];

// Auto-discovered from src/assets/logos/ at build time. Drop a file in and it
// appears here; no code change needed. Filename (without extension) becomes the
// alt text; "(2)", "_logo", trailing digits, etc. are stripped for cleanliness.
const LOGOS = loadLogos();

const WHY_FEATURES = [
  { icon: "⚡", title: "ATS-Friendly CVs", sub: "that Get You Noticed" },
  { icon: "👤", title: "Industry-Expert Writers", sub: "with 5+ Years' Experience" },
  { icon: "🔄", title: "Unlimited Revisions", sub: "for 14 Days" },
  { icon: "📦", title: "Fast Delivery", sub: "in 3-5 Business Days" },
];

const STEPS = [
  {
    n: 1,
    title: "Pick a template",
    body: "Choose the template that best suits your needs. Please note that ATS-friendly CVs do not usually include photos until specifically asked by the recruiters.",
  },
  {
    n: 2,
    title: "Customise and Edit Live",
    body: "Choose your preferred CV and edit it live. You can select the one that suits your requirements best. 2-page CVs are best for most candidates.",
  },
  {
    n: 3,
    title: "Download as DOCX or PDF",
    body: "Once you complete the payment, you will receive a DOCX and a PDF in your given email ID. Therefore, add a verified email address in the box.",
  },
];

const scrollToTemplates = (e) => {
  e?.preventDefault?.();
  const el = document.getElementById("templates");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logoUrl} alt="iCover" className="h-7 sm:h-9 w-auto" />
          </Link>
          <div className="text-[11px] sm:text-sm text-gray-500 text-right">
            <span className="hidden sm:inline">No sign-up · Free · No data stored</span>
            <span className="sm:hidden">Free · No sign-up</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Free CV Builder: Create a Professional CV Online in Minutes
        </h1>
        <p className="mt-3 sm:mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
          Choose from professionally designed templates by UK CV writers. Customise colours,
          fonts, edit inline, then download as DOCX or PDF, instantly.
        </p>

        {/* Feature pills */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2">
          {FEATURE_PILLS.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs sm:text-sm text-gray-700 shadow-sm"
            >
              <span className="text-emerald-500">→</span>
              {p}
            </span>
          ))}
        </div>

        <div className="mt-7 sm:mt-8">
          <a
            href="#templates"
            onClick={scrollToTemplates}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base shadow-sm transition"
          >
            Choose an Editable CV Template ↓
          </a>
        </div>
      </section>

      {/* LOGO STRIP */}
      <LogoStrip />

      {/* TEMPLATE GRID */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-12 sm:pb-16 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8 px-2">
          Choose an Editable CV Template
        </h2>
        <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 px-2">
            How to Build Your CV in 3 Steps?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center max-w-2xl mx-auto mt-3 px-2">
            CV writing is easy, but satisfying the ATS is not. Get an editable instant CV template to impress recruiters!
          </p>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-lg">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ICOVER */}
      <section className="bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 px-2">
            Why 10,000+ Job Seekers Choose iCover
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 px-2">
            Join thousands of professionals who landed their dream jobs with iCover UK
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
            {WHY_FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-orange-100 text-orange-500 text-lg sm:text-xl flex items-center justify-center">
                  {f.icon}
                </div>
                <div className="font-bold text-gray-900 text-xs sm:text-sm mt-3 sm:mt-4">{f.title}</div>
                <div className="text-[11px] sm:text-xs text-gray-500 mt-1">{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {TESTIMONIALS.length > 0 && (
        <section className="bg-white border-y">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 px-2">What Our Clients Say</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 px-2">Join thousands of satisfied professionals who transformed their careers</p>
            <TestimonialCarousel />
          </div>
        </section>
      )}

      {/* CAREER STAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 px-2">
          Choose the Path That Fits Your Career Stage
        </h2>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mt-8 sm:mt-10">
          {/* Instant CV Builder */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="text-xs font-bold tracking-wider text-emerald-600 mb-2">FREE / SELF-SERVE</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Instant CV Builder</h3>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Best if you're just starting out or applying for your first few roles. Pick a template, fill in your details, and download in minutes.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-gray-700 flex-1">
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Students &amp; fresh graduates</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Career changers starting fresh</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> 1 to 3 years of experience</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Download as DOCX or PDF instantly</li>
            </ul>
            <a
              href="#templates"
              onClick={scrollToTemplates}
              className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base transition"
            >
              Build My CV Now
            </a>
          </div>

          {/* Written by a Professional */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="text-xs font-bold tracking-wider text-emerald-400 mb-2">DONE-FOR-YOU</div>
            <h3 className="text-xl sm:text-2xl font-bold">Written by a Professional</h3>
            <p className="mt-3 text-sm sm:text-base text-gray-300">
              Mid-career and senior professionals have complex histories, achievements, and target roles. A professional CV writer makes sure nothing important is left out, and everything is framed to impress hiring managers.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-gray-200 flex-1">
              <li className="flex gap-2"><span className="text-emerald-400">★</span> Mid-level professionals (4 to 10 yrs)</li>
              <li className="flex gap-2"><span className="text-emerald-400">★</span> Senior &amp; executive candidates</li>
              <li className="flex gap-2"><span className="text-emerald-400">★</span> Competitive or specialised industries</li>
              <li className="flex gap-2"><span className="text-emerald-400">★</span> ATS-optimised with expert copywriting</li>
            </ul>
            <a
              href="https://www.icover.org.uk/order-now/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base transition"
            >
              Get a Professional CV →
            </a>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-500 py-6 border-t bg-white">
        © Copyright 2026 iCover
      </footer>
    </div>
  );
}

function LogoStrip() {
  if (LOGOS.length === 0) return null;

  // Duplicate the list so the marquee can loop seamlessly: when the first copy
  // has scrolled fully left (translateX -50%), the second copy is now in place,
  // and the animation snaps back to 0 without any visible jump.
  const track = [...LOGOS, ...LOGOS];

  return (
    <section className="bg-white border-y">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center font-bold text-gray-900 text-sm sm:text-base mb-5 px-2">
          Our Clients Have Been Hired By Leading Companies Including:
        </div>

        {/* Marquee. Fades on the edges so logos don't pop in/out abruptly. */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="logo-marquee flex items-center w-max">
            {track.map((l, idx) => (
              <img
                key={`${l.name}-${idx}`}
                src={l.src}
                alt={l.name}
                aria-hidden={idx >= LOGOS.length ? "true" : undefined}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition mx-6 sm:mx-10 flex-shrink-0"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const total = TESTIMONIALS.length;
  const t = TESTIMONIALS[i];

  const prev = () => setI((x) => (x - 1 + total) % total);
  const next = () => setI((x) => (x + 1) % total);

  return (
    <div className="relative mt-8 sm:mt-10">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 sm:px-8 py-8 sm:py-10">
        {/* Stars */}
        <div className="flex justify-center gap-1 text-orange-400 text-base sm:text-lg">
          {Array.from({ length: t.stars || 5 }).map((_, idx) => (
            <span key={idx}>★</span>
          ))}
        </div>

        <p className="mt-4 italic text-gray-800 text-base sm:text-lg leading-relaxed">
          "{t.quote}"
        </p>

        {t.badge && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <span>✓</span> {t.badge}
          </div>
        )}

        <div className="mt-5">
          <div className="font-bold text-gray-900 text-sm sm:text-base">{t.name}</div>
          <div className="text-xs text-gray-500">
            {t.location}{t.industry ? ` • ${t.industry}` : ""}
          </div>
        </div>
      </div>

      {total > 1 && (
        <>
          {/* Arrows: on mobile they sit just inside the card edge so they
              never get clipped by the viewport; on sm+ they hang off the side. */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow hover:shadow-md text-gray-500 hover:text-gray-900 transition"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow hover:shadow-md text-gray-500 hover:text-gray-900 transition"
            aria-label="Next"
          >
            →
          </button>

          <div className="mt-5 sm:mt-6 flex justify-center gap-1.5 flex-wrap max-w-full">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition ${
                  idx === i ? "bg-emerald-500 w-6" : "bg-gray-300 w-2"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TemplateCard({ template }) {
  const Tmpl = template.component;
  // Card is a fixed THUMB_W wide and stacks vertically on narrow viewports
  // because the parent flex container wraps. The A4 page inside scales by a
  // constant SCALE so the thumbnail looks identical at all breakpoints.
  return (
    <Link
      to={`/edit/${template.id}`}
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden text-left block"
      style={{ width: THUMB_W, maxWidth: "100%" }}
    >
      <div
        className="thumb relative bg-gray-100 overflow-hidden"
        style={{ width: THUMB_W, maxWidth: "100%", height: THUMB_H }}
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
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">{template.name}</h3>
          {template.hasPhoto && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">PHOTO</span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">{template.tagline}</p>
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

// Load every image file from /assets/logos at build time. Returns
// [{ name, src }] sorted alphabetically by display name.
function loadLogos() {
  const modules = import.meta.glob("../assets/logos/*.{svg,png,webp,jpg,jpeg}", {
    eager: true,
    import: "default",
  });
  return Object.entries(modules)
    .map(([path, src]) => {
      const filename = path.split("/").pop();
      const stem = filename.replace(/\.[^.]+$/, "");
      // Clean: drop "(2)", "_logo", "-logo", trailing digits, normalise spaces.
      const name = stem
        .replace(/\s*\(\d+\)$/i, "")
        .replace(/[_-]?logo$/i, "")
        .replace(/[_-]+/g, " ")
        .trim();
      return { name: name || stem, src };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
