import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Wandsworth" — split-header CV. Left half: white bg with tracked-out
// navy name + italic tracked role. Right half: navy #46567a sidebar
// with white contact lines. Below: a soft blue-grey band with a giant
// curly quote glyph + summary paragraph. Body: 2-col (42% left with
// Education / Skills / Awards separated by a divider, 58% right for
// Experience). Montserrat throughout.

const NAVY = "#46567a";
const LIGHT = "#d9dfec";
const QUOTE = "#b9c3d8";
const FONT = "'Montserrat', sans-serif";

export default function WandsworthTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: FONT, color: NAVY }}>
      {/* SPLIT HEADER */}
      <div className="flex" style={{ alignItems: "stretch" }}>
        <div style={{ flex: 1, padding: "56px 40px 28px 52px" }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontWeight: 400, fontSize: 42, letterSpacing: 6, color: NAVY, lineHeight: 1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="uppercase"
            style={{ fontWeight: 600, fontStyle: "italic", fontSize: 17, letterSpacing: 4, color: NAVY, marginTop: 14, paddingLeft: 4 }}
          />
        </div>
        <div className="flex-none" style={{ width: 260, background: NAVY, color: "#fff", padding: "56px 32px 28px", fontSize: 15, lineHeight: 1.9 }}>
          <div><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></div>
          <div><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></div>
          <div><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></div>
        </div>
      </div>

      {/* QUOTE BLOCK */}
      <div className="flex" style={{ background: LIGHT, padding: "30px 52px", alignItems: "flex-start", gap: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 90, lineHeight: 0.7, color: QUOTE, fontFamily: FONT }}>”</div>
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontWeight: 400, fontSize: 17, lineHeight: 1.55, color: NAVY, paddingTop: 6 }}
        />
      </div>

      {/* BODY 2-COL */}
      <div className="flex" style={{ padding: "40px 52px 0" }}>
        <div style={{ width: "42%", paddingRight: 28, borderRight: `1px solid ${QUOTE}` }}>
          <SectionTitle text="Education" />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.4 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}
              />
              <div style={{ fontWeight: 400 }}>
                <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                <br />
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            </div>
          ))}

          <SectionTitle text="Skills" mt={30} />
          <ul style={{ listStyle: "none", fontWeight: 400, fontSize: 15, lineHeight: 1.55 }}>
            {(data.skills || []).map((s, i) => (
              <li key={i} style={{ display: "flex", gap: 10 }}>
                <span>•</span>
                {s}
              </li>
            ))}
          </ul>

          <SectionTitle text="Awards" mt={30} />
          <div style={{ fontSize: 15, lineHeight: 1.5 }}>
            {blocks.languages((l, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <Editable as="div" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} style={{ fontWeight: 700 }} />
                {l.level && (
                  <Editable as="div" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} style={{ fontSize: 14, marginTop: 2 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "58%", paddingLeft: 30 }}>
          <SectionTitle text="Experience" />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 26 }}>
              <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>
                <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                {" | "}
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                <br />
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} style={{ fontWeight: 400 }} />
              </div>
              <ul style={{ listStyle: "none", fontWeight: 400, fontSize: 15, lineHeight: 1.55, marginTop: 12 }}>
                {(exp.bullets || []).map((b, bi) => (
                  <li key={bi} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                    <span>•</span>
                    <Editable
                      as="span"
                      value={b}
                      onChange={(v) => {
                        const next = exp.bullets.slice();
                        next[bi] = v;
                        update(["experience", i, "bullets"], next);
                      }}
                      multiline
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontWeight: 400, fontSize: 21, letterSpacing: 3, marginTop: mt || 0, marginBottom: 14 }}
    >
      {text}
    </Tag>
  );
}
