import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Bexley" — pure minimal business CV in Lato with an Archivo Black
// centered name. Contact line under the name, then rule-divided
// sections: PROFESSIONAL SUMMARY / EDUCATION / RELEVANT EXPERIENCE /
// ADDITIONAL EXPERIENCE / SKILLS.

const INK = "#1a1a1a";
const BODY = "#333";
const RULE = "#111";
const FONT = "'Lato', sans-serif";
const HEAD_FONT = "'Archivo Black', 'Archivo', sans-serif";

export default function BexleyTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const eduFirst = (data.education || [])[0];

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: FONT, color: INK, padding: "48px 52px", boxSizing: "border-box", fontSize: 12, lineHeight: 1.5 }}>
      <Editable
        as="h1"
        value={data.name}
        onChange={(v) => update(["name"], v)}
        className="m-0 text-center uppercase"
        style={{ fontFamily: HEAD_FONT, fontSize: 40, letterSpacing: 1 }}
      />
      <div className="text-center" style={{ marginTop: 10, fontSize: 12, color: BODY, lineHeight: 1.55 }}>
        <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
        {" | "}
        <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
        <br />
        <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
        {" | "}
        <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
      </div>

      <RuleTitle text="Professional Summary" mt={22} />
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ margin: "8px 0 0" }}
      />

      <RuleTitle text="Education" mt={18} />
      {eduFirst && (
        <>
          <div className="flex justify-between" style={{ marginTop: 8 }}>
            <Editable as="span" value={eduFirst.school} onChange={(v) => update(["education", 0, "school"], v)} />
            <Editable as="span" value={eduFirst.date} onChange={(v) => update(["education", 0, "date"], v)} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 4 }}>
            <Editable as="span" value={eduFirst.degree} onChange={(v) => update(["education", 0, "degree"], v)} />
          </div>
        </>
      )}
      {(data.education || []).slice(1).map((ed, idx) => {
        const i = idx + 1;
        return (
          <div key={i} style={{ marginTop: 12 }}>
            <div className="flex justify-between">
              <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
              <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
            </div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>
              <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
            </div>
          </div>
        );
      })}

      <RuleTitle text="Relevant Experience" mt={18} />
      {blocks.experience((exp, i) => (
        <div key={i} style={{ marginTop: i === 0 ? 8 : 16 }}>
          <div className="flex justify-between">
            <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
            <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 4 }}>
            <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
          </div>
          <EditableList
            items={exp.bullets}
            onChange={(v) => update(["experience", i, "bullets"], v)}
            className="bex-list"
            bullet="•"
          />
        </div>
      ))}

      <RuleTitle text="Skills" mt={18} />
      <div style={{ marginTop: 10, lineHeight: 1.7 }}>
        <div>
          <strong>Skills:</strong> {(data.skills || []).join(", ")}
        </div>
        <div>
          <strong>Languages:</strong>{" "}
          {(data.languages || []).map((l, i) => (
            <span key={i}>
              {i > 0 && ", "}
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .bex-list { margin: 8px 0 0; padding-left: 20px; list-style: disc; }
        .bex-list > li { font-size: 12px; line-height: 1.5; margin-bottom: 5px; }
      `}</style>
    </div>
  );
}

function RuleTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <div style={{ borderTop: `1px solid ${RULE}`, marginTop: mt || 0, marginBottom: 12 }} />
      <Tag className="uppercase m-0" style={{ fontWeight: 700, letterSpacing: 1.5, fontSize: 12 }}>
        {text}
      </Tag>
    </>
  );
}
