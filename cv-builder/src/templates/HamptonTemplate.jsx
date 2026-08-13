import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Hampton" — warm cream/tan editorial CV. Cream banner with a big
// tracked-out Lora serif name in burnt orange. Tan Profile panel under
// the header. Body: 2-col main (Education / Experience / Projects
// (mapped from references) on the left, Certifications / Languages /
// Skills on the right). Orange rule near the bottom, then a tan footer
// strip with pipe-separated contacts.

const CREAM = "#fdfbf7";
const BAND = "#faf8f2";
const TAN = "#efe9dc";
const ORANGE = "#b26e1c";
const INK = "#2e2e2e";
const BODY = "#3c3c3c";
const MUTED = "#4c4c4c";
const SERIF = "'Lora', serif";
const SANS = "'PT Sans Narrow', sans-serif";

export default function HamptonTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: CREAM, fontFamily: SANS, color: BODY }}>
      {/* HEADER BANNER */}
      <div style={{ background: BAND, textAlign: "center", padding: "56px 40px 40px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{
            fontFamily: SERIF,
            fontSize: 46,
            fontWeight: 600,
            letterSpacing: 12,
            color: ORANGE,
            marginRight: -12,
          }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 20, color: "#3a3a3a", marginTop: 14, letterSpacing: 1 }}
        />
      </div>

      {/* PROFILE PANEL */}
      <div style={{ background: TAN, padding: "30px 60px 34px" }}>
        <SerifTitle text="Profile" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ margin: "12px 0 0", fontSize: 13.5, lineHeight: 1.5, color: BODY, textAlign: "justify" }}
        />
      </div>

      {/* BODY 2-COL */}
      <div style={{ padding: "40px 60px 0", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 44 }}>
        {/* LEFT */}
        <div>
          <SerifTitle text="Education" />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 14 : 18 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 14, fontWeight: 700, color: INK }}
              />
              <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginTop: 3 }}>
                <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                <span> (</span>
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                <span>)</span>
              </div>
            </div>
          ))}

          <SerifTitle text="Experience" mt={38} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 14 : 22 }}>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                style={{ fontSize: 14, fontWeight: 700, color: INK }}
              />
              <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginTop: 3 }}>
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                <span> (</span>
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                <span>)</span>
              </div>
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="ham-list"
                bullet="•"
              />
            </div>
          ))}

          <SerifTitle text="Projects" mt={38} />
          {/* Reuse references as project entries — an editable list without a new field. */}
          {blocks.references((r, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 14 : 18 }}>
              <Editable
                as="div"
                value={r.name}
                onChange={(v) => update(["references", i, "name"], v)}
                style={{ fontSize: 14, fontWeight: 700, color: INK }}
              />
              <Editable
                as="div"
                value={r.role}
                onChange={(v) => update(["references", i, "role"], v)}
                style={{ fontSize: 12.5, color: BODY, marginTop: 3, lineHeight: 1.4 }}
              />
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div>
          <SerifTitle text="Certifications" />
          <ul style={{ margin: "12px 0 0", paddingLeft: 22, listStyle: "disc" }}>
            {blocks.languages((l, i) => (
              <li key={i} style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 4 }}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <SerifTitle text="Languages" mt={36} />
          <ul style={{ margin: "12px 0 0", paddingLeft: 22, listStyle: "disc" }}>
            <li style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 4 }}>English</li>
            <li style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 4 }}>French</li>
          </ul>

          <SerifTitle text="Skills" mt={36} />
          <ul style={{ margin: "12px 0 0", paddingLeft: 22, listStyle: "disc" }}>
            {(data.skills || []).map((s, i) => (
              <li key={i} style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 4 }}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ORANGE RULE + FOOTER */}
      <div style={{ margin: "60px 60px 0", height: 4, background: ORANGE }} />
      <div
        className="flex flex-wrap"
        style={{ background: TAN, marginTop: 28, padding: "18px 60px", justifyContent: "space-between", gap: 12 }}
      >
        <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} style={{ fontSize: 13, color: MUTED }} />
        <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} style={{ fontSize: 13, color: MUTED }} />
        <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} style={{ fontSize: 13, color: MUTED }} />
        <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} style={{ fontSize: 13, color: MUTED }} />
      </div>

      <style>{`
        .ham-list { margin: 10px 0 0; padding-left: 22px; list-style: disc; }
        .ham-list > li { font-size: 12.5px; line-height: 1.4; color: ${BODY}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function SerifTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 700, color: ORANGE, letterSpacing: 1, marginTop: mt || 0 }}
    >
      {text}
    </Tag>
  );
}
