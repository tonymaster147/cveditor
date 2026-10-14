import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Lewisham" — Poppins. Centered grey name card at top, 2-column
// layout divided by a hairline vertical rule. Left column: CONTACT /
// EDUCATION / SKILLS / LANGUAGES, each with a stub rule after the
// title. Right column: ABOUT ME + WORK EXPERIENCE (62px date gutter).

const INK = "#1a1a1a";
const SOFT = "#2d2d2d";
const RULE = "#c6c6c6";
const RULE_LIGHT = "#d2d2d2";
const RULE_HEAVY = "#b6b6b6";
const FONT = "'Poppins', sans-serif";

export default function LewishamTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ position: "relative", background: "#fff", overflow: "hidden", fontFamily: FONT, color: INK }}
    >
      {/* Header card */}
      <div
        style={{
          position: "absolute",
          top: 58,
          left: "50%",
          transform: "translateX(-50%)",
          width: 498,
          height: 172,
          background: "#ececec",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 42, fontWeight: 700, letterSpacing: 2, color: INK }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 22, fontWeight: 400, letterSpacing: 1, color: SOFT }}
        />
      </div>

      {/* Rules */}
      <div style={{ position: "absolute", top: 262, left: 75, right: 75, height: 1, background: RULE_LIGHT }} />
      <div style={{ position: "absolute", top: 300, left: 75, right: 75, height: 3, background: RULE_HEAVY }} />
      <div style={{ position: "absolute", bottom: 42, left: 75, right: 75, height: 3, background: RULE_HEAVY }} />
      {/* Vertical divider */}
      <div style={{ position: "absolute", top: 370, bottom: 70, left: 384, width: 1, background: "#d6d6d6" }} />

      {/* LEFT COLUMN */}
      <div
        style={{
          position: "absolute",
          top: 366,
          left: 75,
          width: 272,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <StubHead text="Contact" />
        <div style={{ display: "flex", flexDirection: "column", gap: 17, marginTop: -10 }}>
          <ContactRow icon="☎">
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </ContactRow>
          <ContactRow icon="◉">
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </ContactRow>
          <ContactRow icon="⌾">
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </ContactRow>
          <ContactRow icon="✉">
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </ContactRow>
        </div>

        <StubHead text="Education" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: -10 }}>
          {blocks.education((ed, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: INK }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 11.5, color: "#444" }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 11.5, color: "#444" }}
              />
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#e2e2e2", margin: "0 0" }} />

        <StubHead text="Skills" />
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: -10, fontSize: 12.5, color: SOFT }}>
          {(data.skills || []).map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>

        <div style={{ height: 1, background: "#e2e2e2", margin: "0 0" }} />

        <StubHead text="Languages" />
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: -10, fontSize: 12.5, color: SOFT }}>
          {blocks.languages((l, i) => (
            <span key={i}>
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div
        style={{
          position: "absolute",
          top: 366,
          left: 416,
          right: 75,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FullHead text="About Me" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 12.5, lineHeight: 1.75, color: SOFT, textAlign: "justify" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FullHead text="Work Experience" />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "62px 1fr", gap: 14 }}>
              <Editable
                as="span"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 12, fontWeight: 700, color: INK, lineHeight: 1.25 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div>
                  <Editable
                    as="div"
                    value={exp.company}
                    onChange={(v) => update(["experience", i, "company"], v)}
                    className="uppercase"
                    style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.3, color: INK }}
                  />
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontSize: 12.5, color: SOFT }}
                  />
                </div>
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="lew-list"
                  bullet="•"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .lew-list { margin: 0; padding-left: 16px; list-style: disc; }
        .lew-list > li { font-size: 12px; line-height: 1.6; color: #333; margin-bottom: 2px; }
      `}</style>
    </div>
  );
}

function StubHead({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Tag
        className="m-0 uppercase"
        style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: INK }}
      >
        {text}
      </Tag>
      <span style={{ width: 58, height: 1, background: RULE }} />
    </div>
  );
}

function FullHead({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Tag
        className="m-0 uppercase"
        style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: INK, whiteSpace: "nowrap" }}
      >
        {text}
      </Tag>
      <span style={{ flex: 1, height: 1, background: RULE }} />
    </div>
  );
}

function ContactRow({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <span style={{ fontSize: 14, color: INK, width: 16, textAlign: "center" }}>{icon}</span>
      <span style={{ fontSize: 12.5, color: SOFT }}>{children}</span>
    </div>
  );
}
