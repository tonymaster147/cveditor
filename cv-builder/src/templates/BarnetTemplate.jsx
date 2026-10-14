import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Barnet" — Barlow font. Angled brown/navy header with a diagonal cut
// across the top strip. Beige sidebar (About Me / Contact / Skills /
// Language) and a right column with a bold name, timeline-style
// Education & Experience, each entry hung from a dotted vertical rail.

const BROWN = "#8a6a47";
const NAVY = "#26384a";
const BEIGE = "#f2f1ef";
const INK = "#2d2d2d";
const FONT = "'Barlow', sans-serif";

export default function BarnetTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ position: "relative", background: "#fff", overflow: "hidden", fontFamily: FONT, color: INK }}
    >
      {/* Sidebar background */}
      <div style={{ position: "absolute", top: 100, left: 0, width: 340, bottom: 0, background: BEIGE }} />
      {/* Header geometry */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 794, height: 100, background: BROWN }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 794,
          height: 100,
          background: NAVY,
          clipPath: "polygon(0 0,470px 0,360px 100px,0 100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 794,
          height: 100,
          background: "#fff",
          clipPath: "polygon(468px 0,494px 0,386px 100px,360px 100px)",
        }}
      />
      <div style={{ position: "absolute", top: 0, left: 505, width: 289, height: 70, background: NAVY }} />
      {/* Footer geometry */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 794, height: 38, background: NAVY }} />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 794,
          height: 38,
          background: BROWN,
          clipPath: "polygon(300px 0,520px 0,485px 38px,265px 38px)",
        }}
      />

      {/* SIDEBAR */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          width: 340,
          padding: "34px 30px",
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <SidebarHead text="About Me" icon="👤" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontSize: 11.5, lineHeight: 1.75, color: "#555", textAlign: "justify", marginTop: -14 }}
        />

        <SidebarHead text="Contact" icon="☎" />
        <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingLeft: 4, marginTop: -8 }}>
          <IconRow icon="✆">
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </IconRow>
          <IconRow icon="✉">
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </IconRow>
          <IconRow icon="◉">
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </IconRow>
        </div>

        <SidebarHead text="Skills" icon="★" />
        <ul style={{ display: "flex", flexDirection: "column", gap: 11, paddingLeft: 16, marginTop: -8 }}>
          {(data.skills || []).map((s, i) => (
            <li key={i} style={{ fontSize: 14, color: "#333", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#333", flex: "0 0 auto" }} />
              {s}
            </li>
          ))}
        </ul>

        <SidebarHead text="Language" icon="文" />
        <ul style={{ display: "flex", flexDirection: "column", gap: 11, paddingLeft: 16, marginTop: -8 }}>
          {blocks.languages((l, i) => (
            <li key={i} style={{ fontSize: 14, color: "#333", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#333", flex: "0 0 auto" }} />
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT MAIN */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 340,
          right: 0,
          bottom: 38,
          padding: "54px 40px 0 42px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Editable
          as="div"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="uppercase"
          style={{ fontSize: 60, fontWeight: 700, lineHeight: 0.92, color: INK }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 28, color: "#6a6a6a", marginTop: 10, fontWeight: 400 }}
        />

        {/* EDUCATION */}
        <SectionHead text="Education" icon="🎓" mt={56} />
        <div style={{ marginTop: 18 }}>
          {blocks.education((ed, i) => (
            <TimelineRow key={i}>
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 18, fontWeight: 700, color: INK }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.4, color: INK }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 14, color: "#444" }}
              />
            </TimelineRow>
          ))}
        </div>

        {/* EXPERIENCE */}
        <SectionHead text="Experience" icon="💼" mt={24} />
        <div style={{ marginTop: 16 }}>
          {blocks.experience((exp, i) => (
            <TimelineRow key={i}>
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 18, fontWeight: 700, color: INK }}
              />
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                className="uppercase"
                style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.4, color: INK }}
              />
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontSize: 14, color: "#444" }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="bar-list"
                bullet="•"
              />
            </TimelineRow>
          ))}
        </div>
      </div>

      <style>{`
        .bar-list { margin: 6px 0 0; padding-left: 20px; list-style: disc; }
        .bar-list > li { font-size: 14px; line-height: 1.5; color: #333; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function SidebarHead({ text, icon }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
      <span
        style={{
          width: 27,
          height: 27,
          borderRadius: "50%",
          background: INK,
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        {icon}
      </span>
      <Tag className="m-0" style={{ fontSize: 23, fontWeight: 700, color: INK }}>
        {text}
      </Tag>
    </div>
  );
}

function SectionHead({ text, icon, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: mt || 0 }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: INK,
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
        }}
      >
        {icon}
      </span>
      <Tag className="m-0" style={{ fontSize: 26, fontWeight: 700, color: INK }}>
        {text}
      </Tag>
    </div>
  );
}

function IconRow({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 16, color: INK, width: 18, textAlign: "center" }}>{icon}</span>
      <span style={{ fontSize: 14, color: "#333" }}>{children}</span>
    </div>
  );
}

function TimelineRow({ children }) {
  return (
    <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 7 }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: INK }} />
        <div style={{ width: 3, flex: 1, background: INK }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: INK }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingBottom: 6, flex: 1 }}>{children}</div>
    </div>
  );
}
