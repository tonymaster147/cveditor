import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Bloomsbury" — minimal Arimo CV. Big navy-purple name, bright purple
// role, purple-labeled contact line (P: E: A:). Short accent rule.
// Body: rows with a 160px left label column + right content, separated
// by thin lavender rules. Sections: Summary / Work Experience /
// Education / Additional Information.

const NAVY = "#2b2440";
const INK = "#2f2a3f";
const PURPLE = "#8b5cf6";
const RULE = "#d9caf2";
const RULE_SHORT = "#c9b6ee";
const BODY = "#3a3a3a";
const FONT = "'Arimo', Arial, Helvetica, sans-serif";

export default function BloomsburyTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: FONT, color: INK, padding: "44px 52px", boxSizing: "border-box" }}>
      {/* HEADER */}
      <Editable
        as="h1"
        value={data.name}
        onChange={(v) => update(["name"], v)}
        className="m-0 uppercase"
        style={{ fontSize: 52, fontWeight: 400, color: NAVY, lineHeight: 1, letterSpacing: -0.5 }}
      />
      <Editable
        as="div"
        value={data.role}
        onChange={(v) => update(["role"], v)}
        style={{ fontSize: 21, fontWeight: 700, color: PURPLE, marginTop: 10 }}
      />

      <div style={{ marginTop: 18, fontSize: 13, color: BODY, lineHeight: 1.7 }}>
        <div>
          <span style={{ color: PURPLE, fontWeight: 700 }}>P:</span>{" "}
          <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          &nbsp;|&nbsp;
          <span style={{ color: PURPLE, fontWeight: 700 }}>E:</span>{" "}
          <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
        </div>
        <div>
          <span style={{ color: PURPLE, fontWeight: 700 }}>A:</span>{" "}
          <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
        </div>
      </div>

      <div style={{ borderTop: `1.5px solid ${RULE_SHORT}`, width: 90, marginTop: 22 }} />

      {/* SUMMARY */}
      <Row label="Summary">
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: BODY, textAlign: "justify" }}
        />
      </Row>

      <div style={{ borderTop: `1px solid ${RULE}` }} />

      {/* WORK EXPERIENCE */}
      <Row label={<>Work<br />Experience</>}>
        {blocks.experience((exp, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 0 : 18 }}>
            <Editable
              as="div"
              value={exp.company}
              onChange={(v) => update(["experience", i, "company"], v)}
              style={{ fontSize: 14, fontWeight: 700, color: NAVY }}
            />
            <div style={{ fontSize: 13, fontStyle: "italic", color: BODY, marginTop: 4 }}>
              <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
              {" | "}
              <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
            </div>
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="blm-list"
              bullet="•"
            />
          </div>
        ))}
      </Row>

      <div style={{ borderTop: `1px solid ${RULE}` }} />

      {/* EDUCATION */}
      <Row label="Education">
        {blocks.education((ed, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 0 : 16 }}>
            <Editable
              as="div"
              value={ed.school}
              onChange={(v) => update(["education", i, "school"], v)}
              style={{ fontSize: 14, fontWeight: 700, color: NAVY }}
            />
            <div style={{ fontSize: 13, fontStyle: "italic", color: BODY, marginTop: 4 }}>
              <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
              {" | "}
              <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
            </div>
          </div>
        ))}
      </Row>

      <div style={{ borderTop: `1px solid ${RULE}` }} />

      {/* ADDITIONAL INFORMATION */}
      <Row label={<>Additional<br />Information</>} last>
        <ul style={{ paddingLeft: 22, margin: 0, fontSize: 13, lineHeight: 1.6, color: BODY, listStyle: "disc" }}>
          <li style={{ marginBottom: 6, textAlign: "justify" }}>
            <span style={{ fontWeight: 700, color: NAVY }}>Skills:</span>{" "}
            {(data.skills || []).slice(0, 8).join(", ")}
          </li>
          <li>
            <span style={{ fontWeight: 700, color: NAVY }}>Languages:</span>{" "}
            {(data.languages || []).map((l, i) => (
              <span key={i}>
                {i > 0 && ", "}
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </span>
            ))}
          </li>
        </ul>
      </Row>

      <style>{`
        .blm-list { margin: 10px 0 0; padding-left: 22px; list-style: disc; }
        .blm-list > li { font-size: 13px; line-height: 1.55; color: ${BODY}; margin-bottom: 6px; text-align: justify; }
      `}</style>
    </div>
  );
}

function Row({ label, children, last }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 24, padding: last ? "26px 0 0" : "26px 0" }}>
      <Tag
        className="m-0"
        style={{ fontSize: 18, fontWeight: 700, color: NAVY, lineHeight: 1.2 }}
      >
        {label}
      </Tag>
      <div>{children}</div>
    </div>
  );
}
