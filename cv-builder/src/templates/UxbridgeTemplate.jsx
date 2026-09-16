import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Uxbridge" — brown pill header, cream sidebar, dotted decorative
// corners. Cormorant Garamond section titles, Nunito Sans body.
// Sidebar: PERSONAL DETAILS / CONTACT / SKILLS / LANGUAGES.
// Main: summary paragraph, EDUCATION, INTERNSHIPS, PROJECTS,
// CERTIFICATIONS, ACHIEVEMENTS & ACTIVITIES.

const BROWN = "#8a7060";
const CREAM = "#e9dfd2";
const CREAM_TEXT = "#fdfbf8";
const INK = "#2f2a25";
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Nunito Sans', sans-serif";

export default function UxbridgeTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const langs = data.languages || [];

  return (
    <div
      className="cv-page"
      style={{ position: "relative", background: "#fff", fontFamily: SANS, color: INK, overflow: "hidden" }}
    >
      {/* Decorative dot grids */}
      <DotGrid style={{ position: "absolute", left: 26, top: 28 }} cols={5} rows={2} color={BROWN} />
      <DotGrid style={{ position: "absolute", right: 26, bottom: 30 }} cols={4} rows={2} color="#b9b9b9" />

      {/* Cream sidebar background */}
      <div style={{ position: "absolute", left: 74, top: 188, width: 224, bottom: 0, background: CREAM }} />
      {/* Brown pill header */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          position: "absolute",
          left: 104,
          top: 112,
          right: 44,
          height: 114,
          background: BROWN,
          borderRadius: 14,
        }}
      >
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: CREAM_TEXT, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 27, color: CREAM_TEXT, lineHeight: 1, marginTop: 4 }}
        />
      </div>

      {/* Sidebar content */}
      <div style={{ position: "absolute", top: 188, left: 74, width: 224, padding: "114px 20px 30px", boxSizing: "border-box" }}>
        <SerifTitle text="Personal Details" />
        {(langs[0] || langs[1]) && (
          <>
            <FieldPair label="Nationality" value={langs[0]?.name} onChange={(v) => update(["languages", 0, "name"], v)} />
            <FieldPair label="Portfolio" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </>
        )}

        <SerifTitle text="Contact" mt={20} />
        <div style={{ marginTop: 8, fontSize: 12 }}>
          <IconBlock icon="✆" label="Phone" value={data.phone} onChange={(v) => update(["phone"], v)} />
          <IconBlock icon="✉" label="Email" value={data.email} onChange={(v) => update(["email"], v)} />
          <IconBlock icon="●" label="Address" value={data.location} onChange={(v) => update(["location"], v)} />
        </div>

        <SerifTitle text="Skills" mt={20} />
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 12, lineHeight: 1.5 }}>
          {(data.skills || []).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <SerifTitle text="Languages" mt={20} />
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 12, lineHeight: 1.5 }}>
          {blocks.languages((l, i) => (
            <li key={i}>
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
            </li>
          ))}
        </ul>
      </div>

      {/* Main column */}
      <div style={{ position: "absolute", top: 232, left: 310, right: 44, fontSize: 12 }}>
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ margin: "0 0 18px", lineHeight: 1.5 }}
        />

        <SerifTitle text="Education" />
        <div style={{ marginTop: 8 }}>
          {blocks.education((ed, i) => (
            <div
              key={i}
              className="flex justify-between items-baseline"
              style={{ marginTop: i === 0 ? 0 : 10 }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>
                  <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                </div>
                <div style={{ fontStyle: "italic" }}>
                  <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                </div>
              </div>
              <div>
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            </div>
          ))}
        </div>

        <SerifTitle text="Internships & Experience" mt={16} />
        {blocks.experience((exp, i) => (
          <div key={i} style={{ marginTop: 10 }}>
            <div className="flex justify-between items-baseline">
              <div>
                <span style={{ fontWeight: 800 }}>
                  <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                </span>
                {" — "}
                <span style={{ fontStyle: "italic" }}>
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                </span>
              </div>
              <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
            </div>
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="uxb-list"
              bullet="•"
            />
          </div>
        ))}

        <SerifTitle text="References" mt={16} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
          {blocks.references((r, i) => (
            <div key={i}>
              <div style={{ fontWeight: 800 }}>
                <Editable as="span" value={r.name} onChange={(v) => update(["references", i, "name"], v)} />
              </div>
              <div style={{ fontStyle: "italic" }}>
                <Editable as="span" value={r.role} onChange={(v) => update(["references", i, "role"], v)} />
              </div>
              <div style={{ marginTop: 4, fontSize: 11 }}>
                <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                <br />
                <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .uxb-list { margin: 6px 0 0; padding-left: 18px; list-style: disc; }
        .uxb-list > li { font-size: 11.5px; line-height: 1.5; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function SerifTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: 0.5, marginTop: mt || 0 }}
    >
      {text}
    </Tag>
  );
}

function FieldPair({ label, value, onChange }) {
  return (
    <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.35 }}>
      <div style={{ fontWeight: 800 }}>{label}</div>
      <div>
        <Editable as="span" value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function IconBlock({ icon, label, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="flex items-center" style={{ gap: 6, fontWeight: 800 }}>
        <span>{icon}</span>
        {label}
      </div>
      <div style={{ marginLeft: 18 }}>
        <Editable as="span" value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function DotGrid({ style, cols, rows, color }) {
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(<span key={`${r}-${c}`} style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />);
    }
  }
  return (
    <div
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 12px)`,
        gap: 12,
      }}
    >
      {dots}
    </div>
  );
}
