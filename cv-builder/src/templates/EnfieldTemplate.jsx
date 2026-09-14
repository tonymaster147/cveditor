import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Enfield" — Playfair Display serif name over a top-full-width band,
// then a dark-grey (#494a4c) left sidebar with gradient section bars
// (Contact / Education / Skills-with-bars / Languages), and a right
// content column with lighter gradient bars (About Me / Experience /
// References). Lato body.

const DARK_BG = "#494a4c";
const GRAD_DARK = "linear-gradient(to right,#4a4a4c 0%,#7c7c7e 55%,#f2f2f2 100%)";
const GRAD_LIGHT = "linear-gradient(to right,#4a4a4c 0%,#8a8a8c 55%,#ffffff 100%)";
const SANS = "'Lato', sans-serif";
const SERIF = "'Playfair Display', serif";
const BODY = "#3a3a3a";
const INK = "#333";

// Deterministic staggered skill-bar widths.
const SKILL_PCTS = [68, 62, 74, 70, 58, 80, 66, 72];

export default function EnfieldTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: SANS, color: "#2b2b2b", overflow: "hidden" }}>
      {/* NAME BAND */}
      <div className="text-center" style={{ padding: "38px 30px 22px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 46, letterSpacing: 2, color: INK, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 18, color: "#6d6d6d", marginTop: 10, fontWeight: 400 }}
        />
      </div>

      {/* BODY */}
      <div className="flex" style={{ alignItems: "stretch" }}>
        {/* DARK SIDEBAR */}
        <div className="flex-none" style={{ width: 230, background: DARK_BG, color: "#fff", paddingBottom: 30 }}>
          <GradBar text="Contact" gradient={GRAD_DARK} mt={24} />
          <div style={{ padding: "14px 22px 4px 28px", fontSize: 11, display: "grid", gridTemplateColumns: "52px 1fr", rowGap: 10, columnGap: 4, color: "#e6e6e6" }}>
            <span style={{ fontWeight: 700, color: "#fff" }}>Phone:</span>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            <span style={{ fontWeight: 700, color: "#fff" }}>E-Mail:</span>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            <span style={{ fontWeight: 700, color: "#fff" }}>Address:</span>
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </div>

          <GradBar text="Education" gradient={GRAD_DARK} mt={22} />
          <div style={{ padding: "14px 22px 4px 28px", color: "#e6e6e6" }}>
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 14 }}>
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  style={{ fontWeight: 900, color: "#fff", fontSize: 12.5 }}
                />
                <div style={{ fontSize: 11.5, lineHeight: 1.45, marginTop: 2 }}>
                  <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                  <br />
                  <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                </div>
              </div>
            ))}
          </div>

          <GradBar text="Skills" gradient={GRAD_DARK} mt={24} />
          <div style={{ padding: "16px 22px 4px 28px" }}>
            {(data.skills || []).slice(0, 8).map((s, i) => {
              const pct = SKILL_PCTS[i % SKILL_PCTS.length];
              return (
                <div key={i} className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: "#f0f0f0" }}>{s}</span>
                  <span
                    className="inline-block"
                    style={{ width: 74, height: 8, background: "#fff", borderRadius: 5, overflow: "hidden", flex: "none" }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        width: `${pct}%`,
                        background: "linear-gradient(to right,#9a9a9a,#d8d8d8)",
                        borderRadius: 5,
                      }}
                    />
                  </span>
                </div>
              );
            })}
          </div>

          <GradBar text="Languages" gradient={GRAD_DARK} mt={22} />
          <div style={{ padding: "14px 22px 4px 28px", color: "#f0f0f0", fontSize: 12 }}>
            {blocks.languages((l, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 10 }}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN */}
        <div className="flex-1" style={{ padding: "26px 30px 40px 30px" }}>
          <GradBar text="About Me" gradient={GRAD_LIGHT} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13, lineHeight: 1.7, color: BODY, margin: "14px 6px 0" }}
          />

          <GradBar text="Experience" gradient={GRAD_LIGHT} mt={24} />
          <div style={{ marginTop: 14 }}>
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div className="flex justify-between items-baseline">
                  <Editable
                    as="span"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontWeight: 900, fontSize: 16, color: INK }}
                  />
                  <Editable
                    as="span"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    style={{ fontSize: 12, color: INK }}
                  />
                </div>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontSize: 13, color: BODY, marginTop: 3 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="enf-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>

          <GradBar text="References" gradient={GRAD_LIGHT} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
            {blocks.references((r, i) => (
              <div key={i}>
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontWeight: 900, fontSize: 15, color: INK }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 12, color: BODY, marginTop: 2 }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", rowGap: 6, marginTop: 8, fontSize: 11, color: "#4a4a4a" }}>
                  <span style={{ fontWeight: 700 }}>Phone:</span>
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  <span style={{ fontWeight: 700 }}>Email :</span>
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .enf-list { margin: 6px 0 0; padding-left: 20px; list-style: disc; }
        .enf-list > li { font-size: 12px; color: #5a5a5a; line-height: 1.55; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function GradBar({ text, gradient, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div
      className="flex items-center"
      style={{ background: gradient, height: 28, paddingLeft: 24, marginTop: mt || 0 }}
    >
      <Tag
        className="m-0 uppercase"
        style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 15, letterSpacing: 3, color: "#fff" }}
      >
        {text}
      </Tag>
    </div>
  );
}
