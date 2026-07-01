import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Westminster" — formal engineering CV. Navy top strip + gold rule under it,
// centered header with tracked-out name and role, gold rule across body,
// then a two-column layout: main content on the left, light-grey sidebar
// on the right (contact, skills, references).

const NAVY = "#0f1f4b";
const NAVY_SOFT = "#1a3a5c";
const GOLD = "#d4af37";
const SIDEBAR_BG = "#f1f3f5";
const RULE_GREY = "#c9c9c9";
const RULE_DARK = "#8a8a8a";
const BODY = "#333";
const HEADING_DARK = "#1a1a1a";

const FONT = "'Poppins', sans-serif";

export default function WestminsterTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: "#2b2b2b" }}>
      {/* NAVY BAR + GOLD RULE */}
      <div style={{ height: 44, background: NAVY, borderBottom: `4px solid ${GOLD}` }} />

      {/* HEADER */}
      <div className="text-center" style={{ padding: "26px 40px 6px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 56, fontWeight: 600, letterSpacing: 8, color: NAVY_SOFT, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ fontSize: 24, fontWeight: 500, letterSpacing: 1, color: "#2b2b2b", marginTop: 8 }}
        />
        <div className="flex flex-wrap justify-center" style={{ gap: 44, marginTop: 22, fontSize: 15, color: "#2b2b2b" }}>
          <span className="flex items-center" style={{ gap: 10 }}>
            <span style={{ color: NAVY }}>✆</span>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </span>
          <span className="flex items-center" style={{ gap: 10 }}>
            <span style={{ color: NAVY }}>✉</span>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </span>
          <span className="flex items-center" style={{ gap: 10 }}>
            <span style={{ color: NAVY }}>🌐</span>
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </span>
        </div>
      </div>
      <div style={{ height: 3, background: GOLD, margin: "16px 40px 0" }} />

      {/* BODY */}
      <div className="flex">
        {/* LEFT MAIN */}
        <div className="flex-1 box-border" style={{ padding: "34px 30px 44px 40px" }}>
          <Section title="Profile" gold={false} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14, lineHeight: 1.6, color: BODY, margin: "12px 6px 0", textAlign: "justify" }}
          />

          <Section title="Education" gold={false} mt={26} />
          {blocks.education((ed, i) => (
            <div style={{ margin: "12px 6px 0", fontSize: 14, color: BODY }}>
              <div>
                <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                <span> | </span>
                <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                <span> | </span>
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            </div>
          ))}

          <Section title="Experience and Projects" gold mt={26} />
          {blocks.experience((exp, i) => (
            <div style={{ margin: "12px 6px 0", fontSize: 14, color: BODY }}>
              <div>
                <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                <span> | </span>
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              </div>
              <div style={{ marginTop: 4, color: "#555" }}>
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
              </div>
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="wm-bullets"
                bullet="•"
              />
            </div>
          ))}

          <style>{`
            .wm-bullets { margin: 6px 0 0; padding-left: 6px; list-style: none; }
            .wm-bullets > li { font-size: 14px; line-height: 1.6; color: ${BODY}; }
          `}</style>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside
          className="flex-none box-border"
          style={{ width: 300, background: SIDEBAR_BG, padding: "34px 28px 44px" }}
        >
          <SidebarSection title="Contact" />
          <div className="flex flex-col" style={{ marginTop: 16, gap: 16, fontSize: 14, color: BODY }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span style={{ color: NAVY }}>✆</span>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span style={{ color: NAVY }}>✉</span>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span style={{ color: NAVY }}>💼</span>
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span style={{ color: NAVY }}>●</span>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </div>
          </div>

          <SidebarSection title="Skills" mt={26} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="wm-skill-list"
            bullet="○"
          />

          <SidebarSection title="Languages" mt={26} />
          <ul className="wm-skill-list">
            {blocks.languages((l, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="shrink-0">○</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <SidebarSection title="References" mt={26} />
          {data.references && data.references.length > 0 ? (
            <div style={{ marginTop: 12, fontSize: 13, color: BODY }}>
              {blocks.references((r, i) => (
                <div key={i} style={{ marginTop: i === 0 ? 0 : 12 }}>
                  <Editable as="div" value={r.name} onChange={(v) => update(["references", i, "name"], v)} style={{ fontWeight: 700 }} />
                  <Editable as="div" value={r.role} onChange={(v) => update(["references", i, "role"], v)} />
                  <Editable as="div" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 12, fontSize: 14, color: BODY }}>Available upon request</div>
          )}

          <style>{`
            .wm-skill-list { margin: 14px 0 0; padding-left: 6px; list-style: none; }
            .wm-skill-list > li { font-size: 14px; line-height: 1.55; color: ${BODY}; }
          `}</style>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, gold, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 24, fontWeight: 600, letterSpacing: 1, color: NAVY_SOFT, marginTop: mt || 0 }}
      >
        {title}
      </Tag>
      <div style={{ height: 2, background: gold ? GOLD : RULE_GREY, margin: "8px 0 0" }} />
    </>
  );
}

function SidebarSection({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 24, fontWeight: 600, letterSpacing: 1, color: NAVY_SOFT, marginTop: mt || 0 }}
      >
        {title}
      </Tag>
      <div style={{ height: 2, background: RULE_DARK, margin: "8px 0 0" }} />
    </>
  );
}
