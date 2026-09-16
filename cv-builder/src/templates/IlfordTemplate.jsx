import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Ilford" — full-page border frame with a top row (Archivo name +
// tracked role on the left, dark-circle icon contacts on the right),
// an ABOUT ME band, and a 2-col body: SKILLS / DESIGN TOOLS / EDUCATION
// / ACHIEVEMENTS sidebar + EXPERIENCE / REFERENCE main.

const RULE = "#9a9a9a";
const DARK = "#222";
const INK = "#1a1a1a";
const BODY = "#333";
const FONT = "'Lato', sans-serif";
const HEAD_FONT = "'Archivo', sans-serif";

export default function IlfordTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const ref0 = (data.references || [])[0];

  return (
    <div className="cv-page" style={{ background: "#fcfcfc", fontFamily: FONT, color: INK, padding: 18, boxSizing: "border-box", fontSize: 11 }}>
      <div style={{ border: `1px solid ${RULE}`, minHeight: 1087, boxSizing: "border-box" }}>
        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", borderBottom: `1px solid ${RULE}` }}>
          <div style={{ padding: "30px 26px" }}>
            <Editable
              as="h1"
              value={data.name}
              onChange={(v) => update(["name"], v)}
              className="m-0 uppercase"
              style={{ fontFamily: HEAD_FONT, fontWeight: 800, fontSize: 40, lineHeight: 1 }}
            />
            <Editable
              as="div"
              value={data.role}
              onChange={(v) => update(["role"], v)}
              className="uppercase"
              style={{ letterSpacing: 6, fontSize: 14, fontWeight: 600, marginTop: 10 }}
            />
          </div>
          <div
            className="flex flex-col justify-center"
            style={{ borderLeft: `1px solid ${RULE}`, padding: "22px 22px", gap: 12, fontSize: 12 }}
          >
            <IconRow icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconRow>
            <IconRow icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconRow>
            <IconRow icon="🌐"><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></IconRow>
            <IconRow icon="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconRow>
          </div>
        </div>

        {/* About Me band */}
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${RULE}` }}>
          <SectionTitle text="About Me" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ textAlign: "justify", lineHeight: 1.55, margin: "10px 0 0", fontSize: 11.5 }}
          />
        </div>

        {/* Body 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr" }}>
          {/* LEFT */}
          <div style={{ padding: "20px 22px", borderRight: `1px solid ${RULE}` }}>
            <SectionTitle text="Skills" />
            <ul style={{ margin: "0 0 20px", paddingLeft: 18, lineHeight: 1.55, fontSize: 11 }}>
              {(data.skills || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <SectionTitle text="Design Tools" />
            <ul style={{ margin: "0 0 20px", paddingLeft: 18, lineHeight: 1.6, fontSize: 11 }}>
              {blocks.languages((l, i) => (
                <li key={i}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </li>
              ))}
            </ul>

            <SectionTitle text="Education" />
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginBottom: 12, fontSize: 11 }}>
                <div style={{ fontWeight: 700, lineHeight: 1.35 }}>
                  <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                </div>
                <div style={{ marginTop: 3 }}>
                  <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                  {" ("}
                  <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                  {")"}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div style={{ padding: "20px 24px" }}>
            <SectionTitle text="Experience" />
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 12 : 16 }}>
                <div className="flex justify-between items-baseline">
                  <Editable
                    as="span"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    className="uppercase"
                    style={{ fontWeight: 700, letterSpacing: 0.5, fontSize: 12 }}
                  />
                  <Editable
                    as="span"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    style={{ fontWeight: 700, fontSize: 11 }}
                  />
                </div>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontStyle: "italic", fontWeight: 700, color: "#555", marginTop: 3, fontSize: 11 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="ilf-list"
                  bullet="•"
                />
              </div>
            ))}

            {ref0 && (
              <>
                <div style={{ marginTop: 18 }}>
                  <SectionTitle text="Reference" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 11.5, marginTop: 10 }}>
                  <Editable as="span" value={ref0.name} onChange={(v) => update(["references", 0, "name"], v)} />
                  {" — "}
                  <Editable as="span" value={ref0.role} onChange={(v) => update(["references", 0, "role"], v)} />
                </div>
                <div className="flex" style={{ gap: 24, marginTop: 10, fontSize: 11 }}>
                  <IconRow icon="✆"><Editable as="span" value={ref0.phone} onChange={(v) => update(["references", 0, "phone"], v)} /></IconRow>
                  <IconRow icon="✉"><Editable as="span" value={ref0.email} onChange={(v) => update(["references", 0, "email"], v)} /></IconRow>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ilf-list { margin: 6px 0 0; padding-left: 18px; list-style: disc; }
        .ilf-list > li { font-size: 11px; line-height: 1.55; text-align: justify; margin-bottom: 4px; }
      `}</style>
    </div>
  );
}

function SectionTitle({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontWeight: 700, letterSpacing: 0.5, fontSize: 12.5 }}
    >
      {text}
    </Tag>
  );
}

function IconRow({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span
        className="flex items-center justify-center flex-none"
        style={{ width: 20, height: 20, borderRadius: "50%", background: DARK, color: "#fff", fontSize: 10 }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
