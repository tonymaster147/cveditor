import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Hounslow" — Montserrat headings, Lora body. Deep navy sidebar
// (Core Competencies / Education / Contact) split by short white rules.
// White main column with a huge two-line uppercase name, black stub rule,
// blue chevron section markers and decorative outlined triangles,
// dotted rails and dots along the right edge.

const NAVY = "#0a1f44";
const BLUE = "#1b4f9c";
const TEXT = "#333";
const HEAD = "'Montserrat', sans-serif";
const BODY = "'Lora', serif";

export default function HounslowTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ display: "flex", background: "#fff", overflow: "hidden", fontFamily: BODY, color: TEXT }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 303,
          flex: "0 0 303px",
          background: NAVY,
          color: "#fff",
          padding: "214px 32px 44px 40px",
        }}
      >
        <SideHead text="Core Competencies" />
        <ul className="hou-comp">
          {(data.skills || []).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <SideRule />

        <SideHead text="Education" />
        {blocks.education((ed, i) => (
          <div key={i} style={{ marginBottom: 16, lineHeight: 1.35 }}>
            <Editable
              as="div"
              value={ed.degree}
              onChange={(v) => update(["education", i, "degree"], v)}
              style={{ fontSize: 15, fontWeight: 700 }}
            />
            <Editable
              as="div"
              value={ed.school}
              onChange={(v) => update(["education", i, "school"], v)}
              style={{ fontSize: 14 }}
            />
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              ({" "}
              <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />{" "}
              )
            </div>
          </div>
        ))}
        <SideRule />

        <SideHead text="Contact" />
        <ContactItem label="Phone">
          <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
        </ContactItem>
        <ContactItem label="Email">
          <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} />
        </ContactItem>
        <ContactItem label="Address">
          <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} />
        </ContactItem>
        <ContactItem label="LinkedIn">
          <Editable as="div" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
        </ContactItem>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg
          viewBox="430 0 234 1517"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, right: 0, width: 104, height: 1121, pointerEvents: "none", zIndex: 0 }}
        >
          <polyline points="520,40 440,150 520,260" fill="none" stroke={BLUE} strokeWidth="4" />
          <polyline
            points="540,30 640,150 540,270"
            fill="none"
            stroke={BLUE}
            strokeWidth="2.5"
            strokeDasharray="2 7"
            strokeLinecap="round"
          />
          <line x1="545" y1="40" x2="545" y2="470" stroke={BLUE} strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
          <circle cx="545" cy="40" r="7" fill={BLUE} />
          <circle cx="545" cy="470" r="9" fill={BLUE} />
          <polygon points="640,1020 500,1120 640,1220" fill={BLUE} />
          <polyline points="455,1090 500,1120 455,1150" fill="none" stroke={BLUE} strokeWidth="4" />
          <line x1="610" y1="920" x2="610" y2="1290" stroke={BLUE} strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round" />
          <circle cx="610" cy="920" r="9" fill={BLUE} />
          <circle cx="610" cy="1290" r="9" fill={BLUE} />
          <circle cx="650" cy="1080" r="6" fill={BLUE} />
        </svg>

        <div style={{ position: "relative", zIndex: 1, padding: "64px 112px 44px 40px" }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontFamily: HEAD, fontWeight: 800, color: NAVY, fontSize: 62, lineHeight: 0.95, letterSpacing: -1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontWeight: 700, color: NAVY, fontSize: 20, lineHeight: 1.3, marginTop: 10 }}
          />
          <div style={{ width: 70, height: 5, background: "#111", margin: "16px 0 26px" }} />

          <MainHead text="Profile" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}
          />

          <MainHead text="Experience" mt={26} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                className="uppercase"
                style={{ fontWeight: 700, color: NAVY, fontSize: 15, letterSpacing: 0.8 }}
              />
              <div style={{ fontStyle: "italic", fontSize: 13, color: "#444" }}>
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                {" · "}
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
              </div>
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="hou-list"
                bullet="•"
              />
            </div>
          ))}

          <MainHead text="Language" mt={26} />
          {blocks.languages((l, i) => (
            <div key={i} style={{ fontSize: 15, lineHeight: 1.6 }}>
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              {" — "}
              <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .hou-comp { margin: 0; padding: 0; list-style: none; }
        .hou-comp > li { position: relative; padding-left: 18px; margin-bottom: 9px; font-size: 14px; color: #fff; }
        .hou-comp > li:before { content: ""; position: absolute; left: 2px; top: 7px; width: 5px; height: 5px; border-radius: 50%; background: #fff; }
        .hou-list { margin: 4px 0 0; padding: 0; list-style: none; }
        .hou-list > li { font-size: 12.5px; line-height: 1.5; color: #333; margin-bottom: 2px; }
      `}</style>
    </div>
  );
}

function SideHead({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="m-0 uppercase"
      style={{ fontFamily: HEAD, fontWeight: 700, color: "#fff", fontSize: 15.5, letterSpacing: 1.5, marginBottom: 14 }}
    >
      {text}
    </Tag>
  );
}

function SideRule() {
  return <div style={{ width: 170, height: 2, background: "#fff", margin: "20px 0 22px" }} />;
}

function ContactItem({ label, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <div className="uppercase" style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 10.5, letterSpacing: 1.1 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, wordBreak: "break-word" }}>{children}</div>
    </div>
  );
}

function MainHead({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13, marginTop: mt || 0, marginBottom: 12 }}>
      <svg width="34" height="25" viewBox="0 0 46 34" style={{ flex: "0 0 auto" }}>
        <polygon points="0,4 26,4 46,17 26,30 0,30 16,17" fill={BLUE} />
      </svg>
      <Tag
        className="m-0 uppercase"
        style={{ fontFamily: HEAD, fontWeight: 700, color: NAVY, fontSize: 19, letterSpacing: 2.2 }}
      >
        {text}
      </Tag>
    </div>
  );
}
