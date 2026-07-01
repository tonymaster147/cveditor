import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Edinburgh" — elegant, structured single column with a blue header block
// at the top and a matching blue strip at the bottom. Section titles sit
// inline with a blue rule extending to the right edge. Contact line is
// centered pipe-separated below the header block.

const BLUE = "#1a52c4";
const BODY = "#333";
const HEADING_DARK = "#1a1a1a";
const FONT = "'Poppins', sans-serif";

export default function EdinburghTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: "#2b2b2b" }}>
      {/* HEADER BLOCK */}
      <div className="text-center" style={{ background: BLUE, padding: "30px 40px 24px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 44, fontWeight: 700, letterSpacing: 2, color: "#ffffff", lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 19, fontWeight: 600, color: "#ffffff", marginTop: 6 }}
        />
      </div>

      {/* CONTENT */}
      <div className="flex-1" style={{ padding: "22px 52px 30px" }}>
        <div className="text-center" style={{ fontSize: 14, color: "#555", paddingBottom: 22 }}>
          <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          <span> | </span>
          <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          <span> | </span>
          <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
        </div>

        <RuleHeading title="Summary" mt={0} />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontSize: 13.5, lineHeight: 1.7, color: BODY, margin: "16px 0 0", textAlign: "justify" }}
        />

        <RuleHeading title="Work Experience" mt={26} />
        {blocks.experience((exp, i) => (
          <div key={i}>
            <div className="flex justify-between" style={{ marginTop: 16, fontSize: 14 }}>
              <span style={{ fontWeight: 700, color: HEADING_DARK }}>
                <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                {", "}
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              </span>
              <Editable
                as="span"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontWeight: 700, color: HEADING_DARK }}
              />
            </div>
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="ed-list"
              bullet="•"
            />
          </div>
        ))}

        <RuleHeading title="Education" mt={26} />
        {blocks.education((ed, i) => (
          <div key={i}>
            <div className="flex justify-between" style={{ marginTop: 16, fontSize: 14 }}>
              <Editable
                as="span"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, color: HEADING_DARK }}
              />
              <Editable
                as="span"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontWeight: 700, color: HEADING_DARK }}
              />
            </div>
            <Editable
              as="div"
              value={ed.school}
              onChange={(v) => update(["education", i, "school"], v)}
              style={{ fontSize: 13.5, color: BODY, marginTop: 4 }}
            />
          </div>
        ))}

        <RuleHeading title="Key Skills" mt={26} />
        <EditableList
          items={data.skills}
          onChange={(v) => update(["skills"], v)}
          className="ed-skill-list"
          bullet="•"
        />

        <style>{`
          .ed-list { margin: 4px 0 0; padding-left: 6px; list-style: none; }
          .ed-list > li { font-size: 13.5px; line-height: 1.6; color: ${BODY}; }
          .ed-skill-list { margin: 16px 0 0; padding-left: 6px; list-style: none; }
          .ed-skill-list > li { font-size: 13.5px; line-height: 1.7; color: ${BODY}; }
        `}</style>
      </div>

      {/* FOOTER STRIP */}
      <div style={{ height: 20, background: BLUE }} />
    </div>
  );
}

// Inline heading: text left, thin blue rule extending across the rest.
function RuleHeading({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 16, marginTop: mt }}>
      <Tag
        className="uppercase m-0"
        style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5, color: HEADING_DARK, whiteSpace: "nowrap" }}
      >
        {title}
      </Tag>
      <span className="flex-1" style={{ height: 2, background: BLUE }} />
    </div>
  );
}
