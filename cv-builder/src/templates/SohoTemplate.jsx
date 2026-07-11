import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Soho" — trendy, distinctive CV. Left main column with the name stacked
// (small tracked-out first name on top of a huge bold surname), work
// experience and references below. Right sidebar is a dark charcoal
// block with cyan-circle contact icons and white text: Contacts /
// Summary / Education / Skills / Languages. Small cyan footer strip.

const DARK = "#3a3a3a";
const CYAN = "#25a8e0";
const FOOTER = "#3aa0dd";
const RULE_DARK = "#333";
const RULE_SOFT = "#7a7a7a";
const HEADING = "#1a1a1a";
const BODY = "#444";
const FONT = "'Poppins', sans-serif";

// "ELSIE MURRAY" splits into first name (small tracked) + surname (huge).
function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function SohoTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: "#2b2b2b" }}>
      <div className="flex flex-1">
        {/* LEFT MAIN */}
        <div className="flex-1 box-border" style={{ padding: "44px 34px 40px 44px" }}>
          <h1 className="m-0 uppercase" style={{ lineHeight: 1 }}>
            <Editable
              as="span"
              value={first}
              onChange={(v) => update(["name"], `${v} ${rest}`.trim())}
              style={{
                display: "block",
                fontSize: 30,
                fontWeight: 400,
                letterSpacing: 12,
                color: DARK,
              }}
            />
            <Editable
              as="span"
              value={rest}
              onChange={(v) => update(["name"], `${first} ${v}`.trim())}
              style={{
                display: "block",
                fontSize: 66,
                fontWeight: 800,
                letterSpacing: 1,
                color: "#2b2b2b",
                marginTop: 2,
              }}
            />
          </h1>
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontSize: 24, fontWeight: 400, color: "#555", marginTop: 10 }}
          />

          <MainSection title="Work Experience" mt={40} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 20 : 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: HEADING }}>
                <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                <span>, </span>
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              </div>
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 14, color: BODY, marginTop: 6 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="soho-list"
                bullet="•"
              />
            </div>
          ))}

          <MainSection title="References" mt={32} />
          <div className="flex" style={{ gap: 26, marginTop: 16 }}>
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
                  style={{ fontSize: 13, color: "#555" }}
                />
                <div style={{ fontSize: 12.5, color: BODY, marginTop: 8 }}>
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
            .soho-list { margin: 6px 0 0; padding-left: 22px; list-style: disc; }
            .soho-list > li { font-size: 13.5px; line-height: 1.55; color: ${BODY}; }
          `}</style>
        </div>

        {/* RIGHT DARK SIDEBAR */}
        <aside
          className="flex-none box-border"
          style={{ width: 290, background: DARK, color: "#fff", padding: "44px 28px 50px" }}
        >
          <SideTitle title="Contacts" mt={0} />
          <div className="flex flex-col" style={{ marginTop: 18, gap: 16, fontSize: 13, color: "#e6e6e6" }}>
            <PillRow icon="✆">
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </PillRow>
            <PillRow icon="✉">
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </PillRow>
            <PillRow icon="🌐">
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </PillRow>
            <PillRow icon="●" align="start">
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </PillRow>
          </div>

          <SideTitle title="Summary" mt={30} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13, lineHeight: 1.65, color: "#e0e0e0", margin: "14px 0 0", textAlign: "justify" }}
          />

          <SideTitle title="Education" mt={28} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 16 : 14 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 700, fontSize: 13.5, color: "#fff" }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 13, color: "#d8d8d8", marginTop: 4 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13, color: "#d8d8d8" }}
              />
            </div>
          ))}

          <SideTitle title="Skills" mt={28} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="soho-side-list"
            bullet="•"
          />

          <SideTitle title="Languages" mt={28} />
          <ul className="soho-side-list">
            {blocks.languages((l, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="shrink-0">•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <style>{`
            .soho-side-list { margin: 14px 0 0; padding-left: 8px; list-style: none; }
            .soho-side-list > li { font-size: 13.5px; line-height: 1.9; color: #e0e0e0; }
          `}</style>
        </aside>
      </div>

      {/* FOOTER STRIP */}
      <div style={{ height: 26, background: FOOTER }} />
    </div>
  );
}

function MainSection({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 19, fontWeight: 700, color: "#2b2b2b", marginTop: mt }}
      >
        {title}
      </Tag>
      <div style={{ height: 1, background: RULE_DARK, marginTop: 8 }} />
    </>
  );
}

function SideTitle({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.5, marginTop: mt, color: "#fff" }}
      >
        {title}
      </Tag>
      <div style={{ height: 1, background: RULE_SOFT, marginTop: 8 }} />
    </>
  );
}

function PillRow({ icon, align = "center", children }) {
  return (
    <div
      className={align === "start" ? "flex items-start" : "flex items-center"}
      style={{ gap: 12 }}
    >
      <span
        className="flex items-center justify-center flex-none"
        style={{ width: 24, height: 24, borderRadius: "50%", background: CYAN, color: "#fff", fontSize: 11 }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
