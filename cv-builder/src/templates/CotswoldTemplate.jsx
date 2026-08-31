import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Cotswold" — gold header + dark grey subtitle band. Body is 2-col
// (Contact / Education / Skills sidebar + About Me / Work Experience
// main), then a soft lavender footer band with Languages + References.

const GOLD = "#c3b063";
const DARK = "#3e3e3e";
const INK = "#3d3d3d";
const BODY = "#4a4a4a";
const MUTED = "#5a5a5a";
const FADE = "#8a8a8a";
const FOOTER_BG = "#f1eff5";
const FONT = "'Poppins', sans-serif";

export default function CotswoldTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ background: "#fff", fontFamily: FONT, color: INK, overflow: "hidden" }}>
      {/* GOLD HEADER */}
      <div style={{ background: GOLD, padding: "30px 40px 20px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 52, fontWeight: 800, color: INK, lineHeight: 1, letterSpacing: 0.5 }}
        />
      </div>

      {/* DARK ROLE BAND */}
      <div style={{ background: DARK, padding: "14px 40px" }}>
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 20, fontWeight: 500, color: "#fff", letterSpacing: "0.42em" }}
        />
      </div>

      {/* BODY 2-COL */}
      <div className="flex-1" style={{ display: "grid", gridTemplateColumns: "230px 1fr", padding: "30px 40px 20px" }}>
        {/* LEFT sidebar */}
        <div style={{ paddingRight: 26 }}>
          <IconTitle text="Contact" />
          <div style={{ fontSize: 12, color: BODY, lineHeight: 1.9, marginTop: 12 }}>
            <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
            <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} />
            <Editable as="div" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </div>

          <IconTitle text="Education" mt={28} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 12 : 16, fontSize: 12, color: BODY, lineHeight: 1.5 }}>
              <Editable as="div" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 700, color: INK, marginTop: 4 }}
              />
              <Editable as="div" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
            </div>
          ))}

          <IconTitle text="Skills" mt={28} />
          <ul style={{ paddingLeft: 22, margin: "12px 0 0", fontSize: 13.5, color: BODY, lineHeight: 2 }}>
            {(data.skills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* RIGHT main */}
        <div>
          <IconTitle text="About Me" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 12, color: FADE, lineHeight: 1.7, margin: "12px 0 0" }}
          />

          <IconTitle text="Work Experience" mt={28} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 14 : 20 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontSize: 14, fontWeight: 700, color: INK }}
                />
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "0.18em", color: BODY }}
                />
              </div>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                style={{ fontSize: 13, color: BODY, marginTop: 4 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="cot-list"
                bullet="•"
              />
            </div>
          ))}
        </div>
      </div>

      {/* LAVENDER FOOTER */}
      <div style={{ background: FOOTER_BG, padding: "24px 40px 30px", display: "grid", gridTemplateColumns: "230px 1fr" }}>
        <div style={{ paddingRight: 26 }}>
          <IconTitle text="Languages" />
          <ul style={{ paddingLeft: 22, margin: "10px 0 0", fontSize: 13.5, color: BODY, lineHeight: 2 }}>
            {blocks.languages((l, i) => (
              <li key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <IconTitle text="References" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, marginTop: 12 }}>
            {blocks.references((r, i) => (
              <div key={i}>
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
                  style={{ fontSize: 12, color: BODY, marginTop: 2 }}
                />
                <div style={{ fontSize: 10, color: BODY, marginTop: 8, lineHeight: 1.8 }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>Phone:</span>{" "}
                    <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>Email :</span>{" "}
                    <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cot-list { margin: 6px 0 0; padding-left: 20px; list-style: disc; }
        .cot-list > li { font-size: 11.5px; color: ${MUTED}; line-height: 1.55; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function IconTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 10, marginTop: mt || 0 }}>
      <span style={{ color: INK, fontSize: 16 }}>●</span>
      <Tag className="m-0" style={{ fontSize: 17, fontWeight: 600, color: INK }}>
        {text}
      </Tag>
    </div>
  );
}
