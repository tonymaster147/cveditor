import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Notting" — warm real-estate CV. Beige (#fbf1e9) header band with a big
// Playfair Display name, tracked-out role, and a row of 4 dark-circle
// icon contacts with italic Playfair text. Body: About Me at top, then
// a 2-column grid: Experience (left) + Education/Skills-with-bars (right).
// Section headings are big grey tracked-out caps.

const BEIGE = "#fbf1e9";
const DARK = "#1a1a1a";
const INK = "#2b2b2b";
const GREY_HEADING = "#8a8a8a";
const MUTED = "#6f6f6f";
const BODY = "#3a3a3a";
const BAR_TRACK = "#d0d0d0";
const BAR_FILL = "#4a4a4a";
const SERIF = "'Playfair Display', serif";
const SANS = "'Poppins', sans-serif";

// Synthetic staggered percentages so skill bars look right without
// requiring a new data field. Cycles per skill index.
const SKILL_LEVELS = [90, 80, 75, 85, 70, 88, 82, 78];

export default function NottingTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: SANS, color: INK }}>
      {/* BEIGE HEADER BAND */}
      <div style={{ background: BEIGE, padding: "32px 40px 30px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 text-center uppercase"
          style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 48, letterSpacing: 3, color: DARK, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="text-center uppercase"
          style={{ fontWeight: 700, letterSpacing: 3, fontSize: 14, color: INK, marginTop: 10 }}
        />
        <div className="flex flex-wrap" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 24, gap: 12 }}>
          <IconContact icon="🌐">
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </IconContact>
          <IconContact icon="✆">
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </IconContact>
          <IconContact icon="✉">
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </IconContact>
          <IconContact icon="●">
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </IconContact>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "36px 40px 44px" }}>
        <SectionTitle text="About Me" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontWeight: 300, fontSize: 18, lineHeight: 1.5, color: INK, marginTop: 16 }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 40 }}>
          {/* LEFT — Experience */}
          <div>
            <SectionTitle text="Experience" />
            <div style={{ marginTop: 20 }}>
              {blocks.experience((exp, i) => (
                <div key={i} style={{ marginTop: i === 0 ? 0 : 30 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
                    <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                    <br />
                    <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                  </div>
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    className="uppercase"
                    style={{ fontWeight: 700, fontSize: 14, color: DARK, marginTop: 10 }}
                  />
                  <EditableList
                    items={exp.bullets}
                    onChange={(v) => update(["experience", i, "bullets"], v)}
                    className="not-list"
                    bullet="•"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Education + Skills */}
          <div>
            <SectionTitle text="Education" />
            <div style={{ marginTop: 20 }}>
              {blocks.education((ed, i) => (
                <div key={i} style={{ marginTop: i === 0 ? 0 : 26 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
                    <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                    <br />
                    <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                  </div>
                  <Editable
                    as="div"
                    value={ed.degree}
                    onChange={(v) => update(["education", i, "degree"], v)}
                    style={{ fontWeight: 700, fontSize: 14, color: DARK, marginTop: 10 }}
                  />
                </div>
              ))}
            </div>

            <SectionTitle text="Skills" mt={38} />
            <div className="flex flex-col" style={{ marginTop: 20, gap: 18 }}>
              {(data.skills || []).map((s, i) => {
                const pct = SKILL_LEVELS[i % SKILL_LEVELS.length];
                return (
                  <div key={i}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: BODY }}>{s}</div>
                    <div className="flex items-center" style={{ gap: 12, marginTop: 6 }}>
                      <div className="flex-1" style={{ height: 10, borderRadius: 5, background: BAR_TRACK, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: BAR_FILL, borderRadius: 5 }} />
                      </div>
                      <div style={{ fontWeight: 300, fontSize: 24, color: BODY, minWidth: 46, textAlign: "right" }}>{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .not-list { margin: 12px 0 0; padding-left: 18px; list-style: disc; }
        .not-list > li { font-weight: 600; font-size: 13px; color: ${BODY}; line-height: 1.55; margin-bottom: 6px; }
      `}</style>
    </div>
  );
}

function SectionTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontWeight: 700, letterSpacing: 5, fontSize: 20, color: GREY_HEADING, marginTop: mt || 0 }}
    >
      {text}
    </Tag>
  );
}

function IconContact({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span
        className="flex items-center justify-center flex-none"
        style={{ width: 26, height: 26, borderRadius: "50%", background: DARK, color: "#fff", fontSize: 12 }}
      >
        {icon}
      </span>
      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 12 }}>{children}</span>
    </div>
  );
}
