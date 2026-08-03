import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Regent" — bold navy CV with yellow accents. Deep navy top block with
// giant Poppins ELSIE / MURRAY in yellow, white role and summary. Small
// yellow decorative rectangles anchor top-left and bottom-right. Body
// below is white with a 2-column layout (Experience + Expertise +
// Language on left, Education + Contact on right), all section headings
// with a short yellow underline bar.

const NAVY = "#0b1533";
const YELLOW = "#f8d70a";
const INK = "#12203a";
const FONT = "'Poppins', sans-serif";

// Split "ELSIE MURRAY" for the stacked header treatment.
function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function RegentTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: INK, background: "#fff", position: "relative", overflow: "hidden" }}>
      {/* NAVY TOP BLOCK */}
      <div style={{ background: NAVY, padding: "44px 44px 32px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 44, width: 54, height: 26, background: YELLOW }} />
        <Editable
          as="div"
          value={first}
          onChange={(v) => update(["name"], `${v} ${rest}`.trim())}
          className="uppercase"
          style={{ fontWeight: 700, fontSize: 58, letterSpacing: 4, color: YELLOW, lineHeight: 0.92 }}
        />
        <Editable
          as="div"
          value={rest}
          onChange={(v) => update(["name"], `${first} ${v}`.trim())}
          className="uppercase"
          style={{ fontWeight: 400, fontSize: 52, letterSpacing: 6, color: YELLOW, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontWeight: 400, fontSize: 24, color: "#fff", marginTop: 18 }}
        />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ textAlign: "justify", fontSize: 13, lineHeight: 1.5, color: "#fff", margin: "14px 0 0", fontWeight: 300 }}
        />
      </div>

      {/* BODY */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px", padding: "32px 44px 70px" }}>
        {/* LEFT */}
        <div>
          <Title text="Experience" />
          {blocks.experience((exp, i) => (
            <div key={i} className="flex" style={{ gap: 12, marginBottom: 18 }}>
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontStyle: "italic", fontSize: 12, width: 92, flexShrink: 0, lineHeight: 1.4 }}
              />
              <div>
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontWeight: 700, fontSize: 14 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="reg-list"
                  bullet="•"
                />
              </div>
            </div>
          ))}

          <Title text="Expertise" mt={26} />
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, lineHeight: 1.5, listStyle: "disc" }}>
            {(data.skills || []).map((s, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{s}</li>
            ))}
          </ul>

          <Title text="Language" mt={26} />
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, lineHeight: 1.7, listStyle: "disc" }}>
            {blocks.languages((l, i) => (
              <li key={i} className="uppercase">
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <Title text="Education" />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginBottom: 16, fontSize: 13, lineHeight: 1.5 }}>
              <Editable as="div" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
              <Editable as="div" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} style={{ fontWeight: 700 }} />
              <Editable as="div" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} style={{ fontStyle: "italic", fontSize: 12 }} />
            </div>
          ))}

          <Title text="Contact" mt={40} />
          <div className="flex flex-col" style={{ gap: 14, fontSize: 13 }}>
            <IconLine icon="✆">
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </IconLine>
            <IconLine icon="✉">
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </IconLine>
            <IconLine icon="●">
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </IconLine>
            <IconLine icon="🌐">
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </IconLine>
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT YELLOW ANCHOR */}
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 118, height: 52, background: YELLOW }} />

      <style>{`
        .reg-list { margin: 4px 0 0; padding-left: 18px; list-style: disc; }
        .reg-list > li { font-size: 12px; line-height: 1.45; color: ${INK}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function Title({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ marginTop: mt || 0, marginBottom: 14 }}>
      <Tag className="uppercase" style={{ fontWeight: 700, fontSize: 26, color: INK }}>
        {text}
      </Tag>
      <div style={{ width: 40, height: 3, background: YELLOW, marginTop: 6 }} />
    </div>
  );
}

function IconLine({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <span style={{ color: INK, fontSize: 15 }}>{icon}</span>
      {children}
    </div>
  );
}
