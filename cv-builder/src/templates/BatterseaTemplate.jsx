import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Battersea" — pale-blue business-development CV. Full-page pale blue
// wash with two soft-blue decorative circles anchored top-right and
// bottom-left. Big navy name + tracked-out role, summary, then a two-
// column grid where each section starts with a navy pill/capsule
// heading (Education / Certifications / Languages on the left,
// Experience / Skills on the right).

const NAVY = "#1d5c8d";
const PILL = "#2471a4";
const PAGE = "#edf5fa";
const CIRCLE1 = "#ddeef9";
const CIRCLE2 = "#e2f1fb";
const INK = "#16222c";
const BODY = "#2c3944";
const FONT = "'Poppins', sans-serif";

export default function BatterseaTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{
        background: PAGE,
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
        padding: "60px 60px 50px",
        boxSizing: "border-box",
      }}
    >
      {/* DECORATIVE CIRCLES */}
      <div
        style={{ position: "absolute", top: -180, right: -160, width: 380, height: 380, borderRadius: "50%", background: CIRCLE1 }}
      />
      <div
        style={{ position: "absolute", bottom: -220, left: -100, width: 560, height: 560, borderRadius: "50%", background: CIRCLE2 }}
      />

      {/* CONTENT */}
      <div style={{ position: "relative" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 40, fontWeight: 800, color: NAVY, letterSpacing: 1, lineHeight: 1.1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ fontSize: 14, fontWeight: 500, color: "#22303c", letterSpacing: 6, marginTop: 8 }}
        />

        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ margin: "44px 0 0", fontSize: 13, lineHeight: 1.65, color: "#37424c", textAlign: "justify" }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 44 }}>
          {/* LEFT */}
          <div>
            <Pill text="Education" />
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 20 : 18 }}>
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.35 }}
                />
                <div style={{ fontSize: 13, color: BODY, marginTop: 3 }}>
                  <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                  <span> | </span>
                  <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                </div>
              </div>
            ))}

            <Pill text="Certifications" mt={30} />
            <ul style={{ margin: "18px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              {blocks.languages((l, i) => (
                <li key={i} style={{ fontSize: 13, color: BODY, lineHeight: 1.45 }}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </li>
              ))}
            </ul>

            <Pill text="References" mt={30} />
            {blocks.references((r, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 20 : 16 }}>
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontSize: 13, fontWeight: 600, color: INK }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 12, color: BODY, marginTop: 1 }}
                />
                <div style={{ fontSize: 12, color: BODY, marginTop: 4 }}>
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  <br />
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div>
            <Pill text="Experience" />
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 20 : 18 }}>
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontSize: 14, fontWeight: 600, color: INK }}
                />
                <div style={{ fontSize: 13, color: BODY, marginTop: 3 }}>
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                  <span> | </span>
                  <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                </div>
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="bat-list"
                  bullet="•"
                />
              </div>
            ))}

            <Pill text="Skills" mt={30} />
            <ul style={{ margin: "18px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              {(data.skills || []).map((s, i) => (
                <li key={i} style={{ fontSize: 13, color: BODY }}>{s}</li>
              ))}
            </ul>

            <Pill text="Contact" mt={30} />
            <div className="flex flex-col" style={{ gap: 6, marginTop: 18, fontSize: 13, color: BODY }}>
              <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
              <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} />
              <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} />
              <Editable as="div" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bat-list { margin: 10px 0 0; padding-left: 20px; list-style: disc; }
        .bat-list > li { font-size: 12.5px; line-height: 1.45; color: ${BODY}; margin-bottom: 4px; }
      `}</style>
    </div>
  );
}

function Pill({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase text-center m-0"
      style={{
        background: PILL,
        color: "#fff",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: 3,
        padding: "6px 0",
        width: 210,
        marginTop: mt || 0,
      }}
    >
      {text}
    </Tag>
  );
}
