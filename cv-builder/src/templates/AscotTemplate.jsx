import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Ascot" — bold consultant CV. Big centered black-ink name above a
// two-column split. Left column is a lavender panel with a big rounded
// top-right corner containing Contacts / Education (chip headings) /
// Skill / Awards. Right column has PROFILE and WORK EXPERIENCE with
// chip-style company badges and dark navy-tinted titles.

const INK = "#2a2a3f";
const LAV = "#e8e4fb";
const LAV_CHIP = "#d8d1f5";
const RULE = "#b7b0d8";
const BODY = "#3d3d3d";
const FONT = "'Poppins', sans-serif";

export default function AscotTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: BODY }}>
      {/* HEADER */}
      <div className="text-center" style={{ padding: "40px 30px 22px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 52, fontWeight: 900, letterSpacing: 2, color: INK, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ fontSize: 20, fontWeight: 700, letterSpacing: 5, color: BODY, marginTop: 10 }}
        />
      </div>

      {/* BODY */}
      <div className="flex" style={{ alignItems: "stretch" }}>
        {/* LEFT LAVENDER PANEL */}
        <aside
          className="flex-none box-border"
          style={{ width: 275, background: LAV, borderRadius: "0 70px 0 0", padding: "40px 26px 46px 32px" }}
        >
          <div className="flex flex-col" style={{ gap: 12, fontSize: 13, color: INK }}>
            <div>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </div>
            <div>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </div>
            <div>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </div>
          </div>

          <BarTitle text="Education" mt={34} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 16 }}>
              <Chip>
                <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
              </Chip>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 14, fontStyle: "italic", color: BODY, marginTop: 10 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 14, color: BODY }}
              />
            </div>
          ))}

          <BarTitle text="Skill" mt={30} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="ascot-list"
            bullet="•"
          />

          <BarTitle text="Awards" mt={30} />
          <div className="flex flex-col" style={{ marginTop: 18, gap: 14, fontSize: 14, color: BODY }}>
            {blocks.languages((l, i) => (
              <div key={i} style={{ lineHeight: 1.4 }}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </div>

          <style>{`
            .ascot-list { margin: 18px 0 0; padding-left: 22px; list-style: disc; }
            .ascot-list > li { font-size: 14.5px; line-height: 1.9; color: ${BODY}; }
          `}</style>
        </aside>

        {/* RIGHT */}
        <div className="flex-1 box-border" style={{ padding: "40px 40px 46px 32px" }}>
          <BarTitle text="Profile" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14.5, lineHeight: 1.7, color: "#444", margin: "16px 0 0", textAlign: "justify" }}
          />

          <BarTitle text="Work Experience" mt={32} />
          <div className="flex flex-col" style={{ marginTop: 20, gap: 20 }}>
            {blocks.experience((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-center" style={{ gap: 12, flexWrap: "wrap" }}>
                  <Chip strong>
                    <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                  </Chip>
                  <Editable
                    as="div"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic", color: INK }}
                  />
                </div>
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontSize: 14, fontStyle: "italic", color: BODY, marginTop: 8 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="ascot-exp-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>

          <style>{`
            .ascot-exp-list { margin: 8px 0 0; padding-left: 22px; list-style: disc; }
            .ascot-exp-list > li { font-size: 14px; line-height: 1.6; color: #444; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function BarTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 12, marginTop: mt || 0 }}>
      <Tag
        className="uppercase m-0"
        style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1, color: INK, whiteSpace: "nowrap" }}
      >
        {text}
      </Tag>
      <div className="flex-1" style={{ height: 2, background: RULE }} />
      <div className="flex-none" style={{ width: 28, height: 5, background: INK }} />
    </div>
  );
}

function Chip({ children, strong }) {
  return (
    <span
      className="inline-block"
      style={{
        background: LAV_CHIP,
        padding: strong ? "5px 14px" : "5px 12px",
        fontSize: strong ? 15 : 13,
        fontWeight: 700,
        color: INK,
      }}
    >
      {children}
    </span>
  );
}
