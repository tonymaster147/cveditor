import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Belgravia" — minimal two-column CV with rule-divided bands. Split-color
// name (ELSIE dark + MURRAY gold), thin uppercase role. Body is organized
// as 3 horizontal bands, each with a heading strip + content strip:
//   Band 1: Contact | Summary
//   Band 2: Education + Skills | Work Experience
//   Band 3: Certification (mapped to `languages`) | References
// Every band has a 1px black rule top/bottom and a 1px vertical rule
// separating the 236px left column from the flex-right column.

const GOLD = "#c8a02e";
const HEADING = "#1a1a1a";
const HEADING_SOFT = "#2e2e2e";
const BODY = "#333";
const RULE = "#333";
const FONT = "'Lato', sans-serif";
const HEAD_FONT = "'Poppins', sans-serif";

function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function BelgraviaTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);

  return (
    <div
      className="cv-page"
      style={{ fontFamily: FONT, color: BODY, padding: "60px 54px 54px", boxSizing: "border-box" }}
    >
      {/* HEADER */}
      <div className="text-center">
        <h1
          className="m-0 uppercase"
          style={{ fontFamily: HEAD_FONT, fontWeight: 300, fontSize: 52, letterSpacing: 11, lineHeight: 1 }}
        >
          <Editable
            as="span"
            value={first}
            onChange={(v) => update(["name"], `${v} ${rest}`.trim())}
            style={{ color: HEADING_SOFT }}
          />
          {" "}
          <Editable
            as="span"
            value={rest}
            onChange={(v) => update(["name"], `${first} ${v}`.trim())}
            style={{ color: GOLD }}
          />
        </h1>
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontFamily: HEAD_FONT, fontWeight: 300, fontSize: 22, letterSpacing: 9, color: "#5a5a5a", marginTop: 16 }}
        />
      </div>

      {/* BANDS */}
      <div style={{ marginTop: 52, borderTop: `1px solid ${RULE}` }}>
        {/* BAND 1 headers */}
        <BandHeaders left="Contact" right="Summary" />
        <div className="flex" style={{ borderBottom: `1px solid ${RULE}` }}>
          <LeftCell>
            <div className="flex flex-col" style={{ gap: 4, fontSize: 14.5, lineHeight: 1.85, color: BODY }}>
              <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} />
              <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
              <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} />
              <Editable as="div" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </div>
          </LeftCell>
          <RightCell>
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#3a3a3a", textAlign: "justify" }}
            />
          </RightCell>
        </div>

        {/* BAND 2 headers */}
        <BandHeaders left="Education" right="Work Experience" />
        <div className="flex" style={{ borderBottom: `1px solid ${RULE}` }}>
          <LeftCell>
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 18 }}>
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  style={{ fontSize: 14, fontWeight: 700, color: HEADING }}
                />
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontSize: 13.5, color: "#3a3a3a", marginTop: 4 }}
                />
                <Editable
                  as="div"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  style={{ fontSize: 13.5, color: "#3a3a3a" }}
                />
              </div>
            ))}
            <InnerTitle text="Skills" mt={40} />
            <div style={{ height: 1, background: RULE, marginTop: 10 }} />
            <EditableList
              items={data.skills}
              onChange={(v) => update(["skills"], v)}
              className="belg-list"
              bullet="•"
            />
          </LeftCell>
          <RightCell>
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: HEADING }}>
                  <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                  <span>, </span>
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                </div>
                <Editable
                  as="div"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontSize: 14.5, color: "#3a3a3a", marginTop: 8 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="belg-exp-list"
                  bullet="•"
                />
              </div>
            ))}
          </RightCell>
        </div>

        {/* BAND 3 headers — Certification / References */}
        <BandHeaders left="Certification" right="References" />
        <div className="flex">
          <LeftCell tight>
            {/* Repurpose the languages field as certification entries so users
                still get an editable list without a new data model. */}
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14.5, lineHeight: 1.5, color: BODY }}>
              {blocks.languages((l, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </li>
              ))}
            </ul>
          </LeftCell>
          <RightCell tight>
            <div className="flex" style={{ gap: 28 }}>
              {blocks.references((r, i) => (
                <div key={i} className="flex-1">
                  <Editable
                    as="div"
                    value={r.name}
                    onChange={(v) => update(["references", i, "name"], v)}
                    style={{ fontSize: 15.5, fontWeight: 700, color: HEADING }}
                  />
                  <Editable
                    as="div"
                    value={r.role}
                    onChange={(v) => update(["references", i, "role"], v)}
                    style={{ fontSize: 13.5, color: "#4a4a4a", marginTop: 2 }}
                  />
                  <div style={{ fontSize: 13.5, color: BODY, marginTop: 12 }}>
                    <b>Phone:</b>&nbsp;{" "}
                    <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  </div>
                  <div style={{ fontSize: 13.5, color: BODY, marginTop: 5 }}>
                    <b>Email :</b>&nbsp;{" "}
                    <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                  </div>
                </div>
              ))}
            </div>
          </RightCell>
        </div>
      </div>

      <style>{`
        .belg-list { margin: 18px 0 0; padding-left: 20px; list-style: disc; }
        .belg-list > li { font-size: 14.5px; line-height: 2.35; color: ${BODY}; }
        .belg-exp-list { margin: 8px 0 0; padding-left: 20px; list-style: disc; }
        .belg-exp-list > li { font-size: 14px; line-height: 1.5; color: #3a3a3a; }
      `}</style>
    </div>
  );
}

function BandHeaders({ left, right }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex" style={{ borderBottom: `1px solid ${RULE}` }}>
      <div className="flex-none box-border" style={{ width: 236, padding: "12px 24px 12px 0" }}>
        <Tag style={{ fontSize: 22, fontWeight: 400, color: HEADING_SOFT, margin: 0 }}>{left}</Tag>
      </div>
      <div className="flex-1 box-border" style={{ borderLeft: `1px solid ${RULE}`, padding: "12px 0 12px 30px" }}>
        <Tag style={{ fontSize: 22, fontWeight: 400, color: HEADING_SOFT, margin: 0 }}>{right}</Tag>
      </div>
    </div>
  );
}

function InnerTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h3";
  return (
    <Tag style={{ fontSize: 22, fontWeight: 400, color: HEADING_SOFT, marginTop: mt }}>{text}</Tag>
  );
}

function LeftCell({ children, tight }) {
  return (
    <div
      className="flex-none box-border"
      style={{ width: 236, padding: tight ? "20px 24px 26px 0" : "20px 24px 30px 0" }}
    >
      {children}
    </div>
  );
}

function RightCell({ children, tight }) {
  return (
    <div
      className="flex-1 box-border"
      style={{ borderLeft: `1px solid ${RULE}`, padding: tight ? "20px 0 26px 30px" : "20px 0 30px 30px" }}
    >
      {children}
    </div>
  );
}
