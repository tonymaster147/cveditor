import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Barbican" — navy + cream/gold CV. Navy header block with cream ELSIE
// MURRAY name and a secondary blue bar for the role, then icon-contact
// row in cream. Body: cream sidebar (About Me / Skills / Tools mapped
// from languages) + white main (Experience blocks with a soft-blue left
// border + Education).

const NAVY = "#1a4d7a";
const NAVY_MID = "#2e6ea0";
const CREAM = "#f4e3b8";
const CREAM_SOFT = "#f7f1e2";
const HEADER_TEXT = "#eaf1f7";
const RAIL = "#9db8cf";
const INK = "#2b2b2b";
const SANS = "'Nunito', sans-serif";
const HEAD = "'Montserrat', sans-serif";

export default function BarbicanTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: SANS, color: INK, background: "#fff" }}>
      {/* NAVY HEADER */}
      <div style={{ background: NAVY, padding: "32px 32px 22px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 text-center uppercase"
          style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 46, letterSpacing: 2, color: CREAM, lineHeight: 1 }}
        />
        <div style={{ margin: "18px 44px 0", background: NAVY_MID, padding: "9px 0", textAlign: "center" }}>
          <Editable
            as="span"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontSize: 20, color: CREAM_SOFT, letterSpacing: 0.5 }}
          />
        </div>
        <div className="flex flex-wrap" style={{ justifyContent: "space-between", margin: "18px 6px 0", color: HEADER_TEXT, fontSize: 13, gap: 8 }}>
          <IconRow color={CREAM}>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </IconRow>
          <IconRow color={CREAM}>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </IconRow>
          <IconRow color={CREAM}>
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </IconRow>
        </div>
      </div>

      {/* BODY */}
      <div className="flex" style={{ alignItems: "stretch" }}>
        {/* SIDEBAR */}
        <aside className="flex-none box-border" style={{ width: 240, background: CREAM_SOFT, padding: "26px 22px 34px" }}>
          <SideTitle text="About Me" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ margin: "10px 0 0", fontSize: 12.5, lineHeight: 1.5 }}
          />

          <SideTitle text="Skills" mt={24} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="bar-list"
            bullet="•"
          />

          <SideTitle text="Tools" mt={24} />
          <ul className="bar-list">
            {blocks.languages((l, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="shrink-0">•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <style>{`
            .bar-list { margin: 10px 0 0; padding-left: 6px; list-style: none; }
            .bar-list > li { font-size: 12.5px; line-height: 1.55; color: ${INK}; margin-bottom: 4px; }
          `}</style>
        </aside>

        {/* MAIN */}
        <div className="flex-1 box-border" style={{ padding: "26px 30px 34px" }}>
          <MainTitle text="Experience" />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ borderLeft: `2px solid ${RAIL}`, paddingLeft: 18, marginTop: i === 0 ? 12 : 22 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  className="uppercase"
                  style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14, color: NAVY, letterSpacing: 0.3 }}
                />
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14, color: NAVY }}
                />
              </div>
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontWeight: 700, fontSize: 13, marginTop: 3 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="bar-exp-list"
                bullet="•"
              />
            </div>
          ))}

          <MainTitle text="Education" mt={26} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 8 : 14 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, fontSize: 14 }}
              />
              <div style={{ fontSize: 13, marginTop: 3 }}>
                <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                <span> | </span>
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            </div>
          ))}

          <style>{`
            .bar-exp-list { margin: 8px 0 0; padding-left: 18px; list-style: disc; }
            .bar-exp-list > li { font-size: 12.5px; line-height: 1.5; color: ${INK}; margin-bottom: 5px; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function SideTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 18, color: NAVY, marginTop: mt || 0 }}>
      {text}
    </Tag>
  );
}

function MainTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 20, color: NAVY, marginTop: mt || 0 }}>
      {text}
    </Tag>
  );
}

function IconRow({ color, children }) {
  return (
    <span className="inline-flex items-center" style={{ gap: 8 }}>
      <span style={{ color, fontSize: 14 }}>●</span>
      {children}
    </span>
  );
}
