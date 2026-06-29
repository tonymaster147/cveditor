import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Template Monogram" — refined typographic CV. Centered Playfair name in
// olive, soft subtitle, then a thin grey divider band running across, then
// a 300px left sidebar (light grey: Contact / Skills / Education / Language)
// next to the main column (Summary / Experience / References).
//
// No monogram or photo in this revision — purely typographic.

const SIDEBAR_BG = "#ececec";
const NAME = "#5b5048";
const BORDER = "#3a3a3a";
const BAND_BG = "#f4f3f1";
const DARK = "#3a3a3a";
const SOFT = "#555";
const MUTED = "#666";

const SANS = "'Montserrat', sans-serif";
const SERIF = "'Playfair Display', serif";

export default function MonogramSerifTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: SANS, color: "#444" }}>
      {/* HEADER — centered serif name + soft subtitle */}
      <header className="text-center" style={{ padding: "60px 40px 36px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{
            fontFamily: SERIF,
            fontSize: 58,
            fontWeight: 700,
            color: NAME,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 27, color: SOFT, marginTop: 14 }}
        />
      </header>

      {/* THIN DIVIDER BAND */}
      <div
        style={{
          height: 30,
          background: BAND_BG,
          borderTop: `2px solid ${BORDER}`,
          borderBottom: `2px solid ${BORDER}`,
        }}
      />

      {/* BODY */}
      <div className="flex">
        <aside
          className="flex-none box-border"
          style={{ width: 300, background: SIDEBAR_BG, padding: "42px 30px 60px" }}
        >
          <SidebarTitle title="Contact" mt={0} />
          <div className="flex flex-col" style={{ marginTop: 20, gap: 16 }}>
            <Row icon="✆">
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </Row>
            <Row icon="✉">
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </Row>
            <Row icon="●">
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </Row>
          </div>

          <SidebarTitle title="Skills" mt={38} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="mono-list"
            bullet="•"
          />

          <SidebarTitle title="Education" mt={36} />
          {blocks.education((ed, i) => (
            <div style={{ marginTop: 18 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontWeight: 700, fontSize: 14, color: DARK }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontWeight: 700, fontSize: 13, color: DARK, marginTop: 5 }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 13, color: MUTED, marginTop: 7 }}
              />
            </div>
          ))}

          <SidebarTitle title="Language" mt={36} />
          <ul className="mono-list">
            {blocks.languages((l, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="shrink-0">•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <style>{`
            .mono-list { margin: 18px 0 0; padding-left: 6px; list-style: none; }
            .mono-list > li { font-size: 13px; line-height: 2.05; color: ${SOFT}; }
          `}</style>
        </aside>

        <div className="flex-1 box-border" style={{ padding: "42px 36px 60px" }}>
          <SidebarTitle title="Summary" mt={0} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14, lineHeight: 1.75, color: SOFT, margin: "20px 0 0" }}
          />

          <SidebarTitle title="Experience" mt={38} />
          {blocks.experience((exp, i) => (
            <div style={{ marginTop: 22 }}>
              <Editable
                as="h3"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                className="uppercase"
                style={{ fontWeight: 700, fontSize: 14, color: DARK, letterSpacing: 0.5 }}
              />
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontWeight: 700, fontSize: 14, color: "#4a4a4a", marginTop: 8 }}
              />
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontWeight: 700, fontSize: 14, color: "#4a4a4a", marginTop: 6 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="mono-exp-list"
                bullet="•"
              />
            </div>
          ))}
          <style>{`
            .mono-exp-list { margin: 12px 0 0; padding-left: 6px; list-style: none; }
            .mono-exp-list > li { font-size: 13.5px; line-height: 1.6; color: ${SOFT}; }
          `}</style>

          <SidebarTitle title="References" mt={36} />
          <div className="flex" style={{ gap: 26, marginTop: 22 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  className="uppercase"
                  style={{ fontWeight: 700, fontSize: 14, color: DARK }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontWeight: 700, fontSize: 13, color: "#4a4a4a", marginTop: 6 }}
                />
                <div style={{ fontSize: 13, color: SOFT, marginTop: 12 }}>
                  <b>Phone:</b>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 13, color: SOFT, marginTop: 6 }}>
                  <b>Email :</b>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tracked-out sidebar/section heading (no underline, just spacing).
function SidebarTitle({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontWeight: 700, letterSpacing: 6, fontSize: 18, color: DARK, marginTop: mt }}
    >
      {title}
    </Tag>
  );
}

function Row({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 14, fontSize: 13, color: "#4a4a4a" }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
