import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Chelsea" — stylish, modern CV. Big cyan name at the top, grey sidebar
// on the left (Contact / Education / Expertise / Language) and a white
// main column on the right. Experience items sit on a vertical grey rail
// with hollow cyan-bordered dots. Blue footer strip anchors the page.

const CYAN = "#25a8e0";
const FOOTER = "#3aa0dd";
const SIDEBAR_BG = "#f2f2f2";
const RAIL = "#cfcfcf";
const HEADING = "#2b2b2b";
const BODY = "#444";
const MUTED = "#777";
const FONT = "'Poppins', sans-serif";

export default function ChelseaTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: "#333" }}>
      {/* HEADER */}
      <div className="text-center" style={{ padding: "56px 40px 30px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 60, fontWeight: 800, letterSpacing: 4, color: CYAN, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 26, letterSpacing: 4, color: "#555", marginTop: 12 }}
        />
      </div>

      {/* BODY */}
      <div className="flex flex-1">
        {/* LEFT SIDEBAR */}
        <aside
          className="flex-none box-border"
          style={{ width: 300, background: SIDEBAR_BG, padding: "34px 30px 50px" }}
        >
          <Section title="Contact" mt={0} />
          <div className="flex flex-col" style={{ marginTop: 18, gap: 18, fontSize: 13.5, color: BODY }}>
            <Row icon="✆">
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </Row>
            <Row icon="✉">
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </Row>
            <Row icon="🌐">
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </Row>
            <Row icon="●" align="start">
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </Row>
          </div>

          <Section title="Education" mt={30} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 16 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, fontSize: 15, color: HEADING }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 700, fontSize: 13.5, color: BODY, marginTop: 2 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13.5, color: "#666", marginTop: 2 }}
              />
            </div>
          ))}

          <Section title="Expertise" mt={30} />
          <div className="flex flex-col" style={{ marginTop: 16, gap: 14, fontSize: 14, color: BODY }}>
            {(data.skills || []).map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>

          <Section title="Language" mt={30} />
          <div className="flex flex-col" style={{ marginTop: 16, gap: 14, fontSize: 14, color: BODY }}>
            {blocks.languages((l, i) => (
              <div key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT MAIN */}
        <div className="flex-1 box-border" style={{ padding: "34px 40px 40px" }}>
          <Section title="About Me" mt={0} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14, lineHeight: 1.7, color: BODY, margin: "14px 0 0", textAlign: "justify" }}
          />

          <Section title="Experience" mt={26} />
          {blocks.experience((exp, i) => (
            <div
              key={i}
              style={{
                marginTop: i === 0 ? 18 : 0,
                marginLeft: 6,
                position: "relative",
                paddingLeft: 28,
                borderLeft: `2px solid ${RAIL}`,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: -8,
                  top: 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#fff",
                  border: `2px solid ${CYAN}`,
                }}
              />
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 14.5, color: "#555" }}
              />
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontSize: 15, color: CYAN, marginTop: 2 }}
              />
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                style={{ fontSize: 19, fontWeight: 500, color: HEADING, marginTop: 4 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="chelsea-list"
                bullet="•"
              />
              <div style={{ height: 18 }} />
            </div>
          ))}

          <Section title="Reference" mt={22} />
          <div className="flex" style={{ gap: 30, marginTop: 16 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontWeight: 700, fontSize: 15, color: HEADING }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 13.5, color: "#555" }}
                />
                <div style={{ fontSize: 12.5, color: BODY, marginTop: 10 }}>
                  <b>Phone:</b>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 12.5, color: BODY, marginTop: 4 }}>
                  <b>Email :</b>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .chelsea-list { margin: 8px 0 0; padding-left: 6px; list-style: none; }
            .chelsea-list > li { font-size: 12.5px; line-height: 1.55; color: ${MUTED}; }
          `}</style>
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div style={{ height: 30, background: FOOTER }} />
    </div>
  );
}

function Section({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1, color: HEADING, marginTop: mt ?? 30 }}
      >
        {title}
      </Tag>
      <div style={{ height: 2, background: CYAN, marginTop: 8 }} />
    </>
  );
}

function Row({ icon, align = "center", children }) {
  return (
    <div
      className={align === "start" ? "flex items-start" : "flex items-center"}
      style={{ gap: 14 }}
    >
      <span style={{ color: CYAN, fontSize: 15 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
