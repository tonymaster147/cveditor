import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Twickenham" — sage/leaf CV. Left 232px sage-green (#dce4d6) sidebar
// (Contact Me / My Skills / Education), thin sage rules between blocks.
// Right main column: light grey ELSIE MURRAY name, muted role, summary,
// thin rule, then Work Experience with each entry lightly indented.

const SAGE = "#dce4d6";
const SAGE_RULE = "#b7c1ac";
const SOFT_RULE = "#d0d0d0";
const INK = "#4a4a4a";
const NAME_INK = "#5f5f5f";
const ROLE_INK = "#7a7a7a";
const BODY = "#555";
const MUTED = "#6f6f6f";
const FONT = "'Lato', sans-serif";

export default function TwickenhamTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex" style={{ background: "#fff", fontFamily: FONT, color: INK, overflow: "hidden" }}>
      {/* SAGE SIDEBAR */}
      <div
        className="flex-none"
        style={{ width: 220, background: SAGE, padding: "110px 22px 40px" }}
      >
        <SideTitle text="Contact Me" />
        <div className="flex flex-col" style={{ gap: 16, marginBottom: 20 }}>
          <IconRow letter="●" color={MUTED}>
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </IconRow>
          <IconRow letter="✆" color={MUTED}>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </IconRow>
          <IconRow letter="✉" color={MUTED}>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </IconRow>
          <IconRow letter="🌐" color={MUTED}>
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </IconRow>
        </div>

        <div style={{ borderTop: `1.5px solid ${SAGE_RULE}`, marginBottom: 22 }} />
        <SideTitle text="My Skills" />
        <ul style={{ listStyle: "disc", paddingLeft: 18, margin: "0 0 22px", fontWeight: 400, fontSize: 11.5, color: INK, lineHeight: 1 }}>
          {(data.skills || []).map((s, i) => (
            <li key={i} style={{ marginBottom: 10 }}>{s}</li>
          ))}
        </ul>

        <div style={{ borderTop: `1.5px solid ${SAGE_RULE}`, marginBottom: 22 }} />
        <SideTitle text="Education" />
        {blocks.education((ed, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: INK }}>
              || <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
            </div>
            <Editable
              as="div"
              value={ed.school}
              onChange={(v) => update(["education", i, "school"], v)}
              style={{ fontWeight: 400, fontSize: 11.5, color: INK, marginTop: 3 }}
            />
            <Editable
              as="div"
              value={ed.date}
              onChange={(v) => update(["education", i, "date"], v)}
              style={{ fontWeight: 400, fontSize: 11.5, color: INK }}
            />
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1" style={{ padding: "44px 38px 30px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontWeight: 300, fontSize: 40, color: NAME_INK, letterSpacing: 1, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontWeight: 400, fontSize: 17, color: ROLE_INK, marginTop: 6, marginBottom: 22 }}
        />

        <MainTitle text="Summary" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontWeight: 400, fontSize: 12.5, lineHeight: 1.75, color: BODY, margin: "0 0 16px" }}
        />
        <div style={{ borderTop: `1.5px solid ${SOFT_RULE}`, marginBottom: 20 }} />

        <MainTitle text="Work Experience" />
        {blocks.experience((exp, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: INK, marginBottom: 3 }}>
              <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
            </div>
            <div style={{ fontWeight: 400, fontSize: 12.5, color: BODY, marginBottom: 4 }}>
              <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              <span> · </span>
              <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
            </div>
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="twi-list"
              bullet="•"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SideTitle({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontWeight: 700, fontSize: 17, color: INK, letterSpacing: 0.5, marginBottom: 16 }}
    >
      {text}
    </Tag>
  );
}

function MainTitle({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontWeight: 700, fontSize: 17, color: INK, letterSpacing: 0.5, marginBottom: 12 }}
    >
      {text}
    </Tag>
  );
}

function IconRow({ letter, color, children }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <span style={{ color, fontSize: 15 }}>{letter}</span>
      <span style={{ fontSize: 12, color: INK }}>{children}</span>
    </div>
  );
}
