import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Hammersmith" — Poppins CV. Header row (name + role on the left,
// dark-circle icon contacts on the right), then a light-grey rounded
// ABOUT ME + EDUCATION card, then a WORK EXPERIENCE section with a
// grey background rail behind the dates column, and a SKILLS +
// LANGUAGES footer row (languages with soft-tan strength bars).

const CARD = "#efefef";
const RULE = "#b7b7b7";
const DARK = "#2b2b2b";
const BODY = "#333";
const MUTED = "#666";
const TAN_TRACK = "#e7e1db";
const TAN_FILL = "#8a7a6f";
const FONT = "'Poppins', sans-serif";

const LANG_PCTS = [78, 88, 66, 72];

export default function HammersmithTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const total = (data.experience || []).length;

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: FONT, color: "#2a2a2a", padding: "40px 46px", boxSizing: "border-box", fontSize: 11.5 }}>
      {/* HEADER */}
      <div className="flex" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontWeight: 700, fontSize: 34, letterSpacing: 1, color: DARK, lineHeight: 1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontWeight: 400, fontSize: 16, color: "#555", marginTop: 8 }}
          />
        </div>
        <div className="flex flex-col" style={{ gap: 8, fontSize: 12, paddingTop: 4 }}>
          <IconRow icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconRow>
          <IconRow icon="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconRow>
          <IconRow icon="🌐"><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></IconRow>
          <IconRow icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconRow>
        </div>
      </div>

      {/* GREY ABOUT ME + EDUCATION CARD */}
      <div style={{ background: CARD, borderRadius: 10, padding: "22px 24px", marginTop: 20 }}>
        <CardTitle text="About Me" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ textAlign: "justify", lineHeight: 1.6, margin: "10px 0 20px", fontSize: 11 }}
        />
        <div className="flex items-center" style={{ gap: 16, marginBottom: 14 }}>
          <CardTitle text="Education" />
          <span className="flex-1" style={{ height: 1, background: RULE }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
          {blocks.education((ed, i) => (
            <div
              key={i}
              style={{
                paddingLeft: i === 0 ? 0 : 20,
                paddingRight: i === 2 ? 0 : 20,
                borderLeft: i === 0 ? "none" : `1px solid #c3c3c3`,
              }}
            >
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontWeight: 600, letterSpacing: 0.5, fontSize: 11 }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ color: MUTED, marginTop: 3, fontSize: 11 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ color: MUTED, fontSize: 11 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* WORK EXPERIENCE */}
      <div className="flex items-center" style={{ gap: 16, marginTop: 24 }}>
        <CardTitle text="Work Experience" />
        <span className="flex-1" style={{ height: 1, background: RULE }} />
      </div>
      <div style={{ position: "relative", marginTop: 14 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 150, background: CARD, borderRadius: 8 }} />
        <div className="flex flex-col" style={{ position: "relative", gap: total > 1 ? 22 : 0, padding: "18px 0" }}>
          {blocks.experience((exp, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr" }}>
              <div style={{ fontWeight: 700, fontSize: 12, paddingLeft: 16 }}>
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
              </div>
              <div style={{ paddingLeft: 20 }}>
                <div style={{ fontWeight: 700, letterSpacing: 0.5, fontSize: 12 }}>
                  <Editable
                    as="span"
                    value={exp.company}
                    onChange={(v) => update(["experience", i, "company"], v)}
                    className="uppercase"
                  />
                  {" — "}
                  <Editable
                    as="span"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    className="uppercase"
                  />
                </div>
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="ham-list"
                  bullet="•"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS + LANGUAGES */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 22 }}>
        <div>
          <div className="flex items-center" style={{ gap: 14 }}>
            <CardTitle text="Skills" />
            <span className="flex-1" style={{ height: 1, background: DARK }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginTop: 12, lineHeight: 1.5, fontSize: 11 }}>
            {(data.skills || []).map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center" style={{ gap: 14 }}>
            <CardTitle text="Languages" />
            <span className="flex-1" style={{ height: 1, background: DARK }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
            {blocks.languages((l, i) => {
              const pct = LANG_PCTS[i % LANG_PCTS.length];
              return (
                <div key={i}>
                  <Editable as="div" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} style={{ fontSize: 11 }} />
                  <div style={{ height: 6, background: TAN_TRACK, borderRadius: 4, marginTop: 6 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: TAN_FILL, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .ham-list { margin: 6px 0 0; padding-left: 18px; list-style: disc; }
        .ham-list > li { font-size: 10.5px; line-height: 1.55; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function CardTitle({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag className="uppercase m-0" style={{ fontWeight: 600, fontSize: 16, letterSpacing: 1 }}>
      {text}
    </Tag>
  );
}

function IconRow({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span
        className="flex items-center justify-center flex-none"
        style={{ width: 18, height: 18, borderRadius: "50%", background: DARK, color: "#fff", fontSize: 9 }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
