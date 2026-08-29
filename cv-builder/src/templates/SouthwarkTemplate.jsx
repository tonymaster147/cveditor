import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Southwark" — purple-accent CV. Left 260px lilac (#eef1fb) inset
// sidebar with ABOUT ME / SKILLS / REWARD / LANGUAGES. Right main
// column with a big stacked name (light ELSIE + bold MURRAY in purple),
// then contact icons, WORK EXPERIENCE / EDUCATION / REFERENCES.

const PURPLE = "#6c63b5";
const PURPLE_LIGHT = "#8d85c6";
const LILAC = "#eef1fb";
const BODY = "#555";
const INK = "#333";
const SANS = "'Poppins', sans-serif";
const HEAD = "'Montserrat', sans-serif";

function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function SouthwarkTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);

  return (
    <div className="cv-page flex" style={{ background: "#fff", fontFamily: SANS, color: "#3a3a3a", overflow: "hidden" }}>
      {/* LEFT SIDEBAR (inset box) */}
      <div
        className="flex-none"
        style={{ width: 240, background: LILAC, margin: "28px 0 28px 20px", padding: "30px 22px", alignSelf: "flex-start" }}
      >
        <SideTitle text="About Me" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontWeight: 400, fontSize: 11.5, lineHeight: 1.75, color: BODY, textAlign: "justify", margin: "0 0 26px" }}
        />

        <SideTitle text="Skills" />
        <ul style={{ listStyle: "disc", paddingLeft: 18, margin: "0 0 26px", fontWeight: 400, fontSize: 12.5, color: "#444", lineHeight: 1 }}>
          {(data.skills || []).map((s, i) => (
            <li key={i} style={{ marginBottom: 12 }}>{s}</li>
          ))}
        </ul>

        <SideTitle text="Reward" />
        <div style={{ marginBottom: 24 }}>
          {blocks.languages((l, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 400, fontSize: 11, color: "#666" }}>
                {l.level ? (
                  <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
                ) : (
                  "Award"
                )}
              </div>
              <Editable
                as="div"
                value={l.name}
                onChange={(v) => update(["languages", i, "name"], v)}
                style={{ fontWeight: 700, fontSize: 12, color: "#333" }}
              />
            </div>
          ))}
        </div>

        <SideTitle text="Languages" />
        <div style={{ fontWeight: 400, fontSize: 13, color: "#444" }}>
          <div style={{ marginBottom: 12 }} className="uppercase">English</div>
          <div className="uppercase">French</div>
        </div>
      </div>

      {/* RIGHT MAIN */}
      <div className="flex-1" style={{ padding: "26px 32px 32px 28px" }}>
        <div className="uppercase" style={{ fontFamily: HEAD, fontWeight: 300, fontSize: 40, lineHeight: 0.95, color: PURPLE_LIGHT, letterSpacing: 1 }}>
          <Editable as="span" value={first} onChange={(v) => update(["name"], `${v} ${rest}`.trim())} />
        </div>
        <div className="uppercase" style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, lineHeight: 1, color: PURPLE, letterSpacing: 3, marginBottom: 8 }}>
          <Editable as="span" value={rest} onChange={(v) => update(["name"], `${first} ${v}`.trim())} />
        </div>
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontWeight: 400, fontSize: 18, letterSpacing: 3, color: BODY, marginBottom: 10 }}
        />
        <div className="flex flex-wrap items-center" style={{ gap: 26, fontSize: 13, color: "#444", marginBottom: 20 }}>
          <span className="flex items-center" style={{ gap: 8 }}>
            <span style={{ color: PURPLE, fontSize: 13 }}>✆</span>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </span>
          <span className="flex items-center" style={{ gap: 8 }}>
            <span style={{ color: PURPLE, fontSize: 13 }}>✉</span>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </span>
        </div>

        <MainTitle text="Work Experience" />
        {blocks.experience((exp, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: INK }}>
              <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              <span> | </span>
              <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
            </div>
            <Editable
              as="div"
              value={exp.title}
              onChange={(v) => update(["experience", i, "title"], v)}
              style={{ fontWeight: 400, fontSize: 13, color: BODY, marginBottom: 5 }}
            />
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="sou-list"
              bullet="•"
            />
          </div>
        ))}

        <MainTitle text="Education" mt={4} />
        {blocks.education((ed, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: INK }}>
              <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
              <span> | </span>
              <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
            </div>
            <Editable
              as="div"
              value={ed.school}
              onChange={(v) => update(["education", i, "school"], v)}
              style={{ fontWeight: 400, fontSize: 13, color: BODY }}
            />
          </div>
        ))}

        <MainTitle text="References" mt={4} />
        <div className="flex" style={{ gap: 28 }}>
          {blocks.references((r, i) => (
            <div key={i} className="flex-1">
              <Editable
                as="div"
                value={r.name}
                onChange={(v) => update(["references", i, "name"], v)}
                style={{ fontWeight: 700, fontSize: 15, color: INK }}
              />
              <Editable
                as="div"
                value={r.role}
                onChange={(v) => update(["references", i, "role"], v)}
                style={{ fontWeight: 400, fontSize: 12, color: BODY, marginTop: 1 }}
              />
              <div style={{ marginTop: 8, fontSize: 10, color: "#444", lineHeight: 1.9 }}>
                <span style={{ fontWeight: 700 }}>Phone:</span>{" "}
                <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                <br />
                <span style={{ fontWeight: 700 }}>Email :</span>{" "}
                <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sou-list { list-style: disc; padding-left: 20px; margin: 0; }
        .sou-list > li { font-weight: 400; font-size: 12px; color: #666; line-height: 1.5; margin-bottom: 2px; }
      `}</style>
    </div>
  );
}

function SideTitle({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 22, color: PURPLE, letterSpacing: 0.5, marginBottom: 14 }}
    >
      {text}
    </Tag>
  );
}

function MainTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 22, color: PURPLE, letterSpacing: 0.5, marginTop: mt || 0, marginBottom: 10 }}
    >
      {text}
    </Tag>
  );
}
