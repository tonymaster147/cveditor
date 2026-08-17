import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Ealing" — cream background scattered with soft-beige decorative
// circles, Montserrat headings in navy, Nunito Sans body. Body is a
// 2-column grid: left (About Me / Skills / Contact), right (Education /
// Experience). Each section title sits above a thin navy rule that ends
// with a small navy dot.

const CREAM = "#fdf8ee";
const NAVY = "#2f4d6e";
const INK = "#20262c";
const C1 = "#efe3cf";
const C2 = "#f3ead9";
const C3 = "#f1e6d3";
const C4 = "#f2e8d6";
const SANS = "'Nunito Sans', sans-serif";
const HEAD = "'Montserrat', sans-serif";

export default function EalingTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ background: CREAM, position: "relative", overflow: "hidden", fontFamily: SANS, color: INK }}
    >
      {/* DECORATIVE CIRCLES */}
      <div style={{ position: "absolute", top: -120, left: -90, width: 340, height: 340, borderRadius: "50%", background: C1 }} />
      <div style={{ position: "absolute", top: 20, left: 90, width: 120, height: 120, borderRadius: "50%", background: C2 }} />
      <div style={{ position: "absolute", top: 55, right: 60, width: 150, height: 150, borderRadius: "50%", background: C3 }} />
      <div style={{ position: "absolute", bottom: -90, left: 340, width: 220, height: 220, borderRadius: "50%", background: C4 }} />
      <div style={{ position: "absolute", bottom: 40, left: 430, width: 120, height: 120, borderRadius: "50%", border: `14px solid ${C1}`, background: "transparent" }} />

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 2, padding: "50px 45px" }}>
        <div className="text-center" style={{ marginBottom: 40 }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, letterSpacing: 1, color: NAVY, lineHeight: 1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontFamily: HEAD, fontWeight: 500, fontSize: 26, color: INK, marginTop: 10 }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 40 }}>
          {/* LEFT */}
          <div>
            <RuleTitle text="About Me" />
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ fontSize: 13, lineHeight: 1.55, margin: "0 0 24px" }}
            />

            <RuleTitle text="Skills:" />
            <EditableList
              items={data.skills}
              onChange={(v) => update(["skills"], v)}
              className="eal-list"
              bullet="•"
            />

            <RuleTitle text="Contact" mt={20} />
            <div className="flex flex-col" style={{ gap: 12, fontSize: 13 }}>
              <ContactRow icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></ContactRow>
              <ContactRow icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></ContactRow>
              <ContactRow icon="🌐"><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></ContactRow>
              <ContactRow icon="●" align="start"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></ContactRow>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <RuleTitle text="Education" />
            {blocks.education((ed, i) => (
              <div key={i} style={{ fontSize: 13, lineHeight: 1.5, marginBottom: i === (data.education?.length || 0) - 1 ? 24 : 20 }}>
                <Editable as="div" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontWeight: 700, fontStyle: "italic" }}
                />
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  style={{ fontWeight: 700 }}
                />
              </div>
            ))}

            <RuleTitle text="Experience:" mt={12} />
            {blocks.experience((exp, i) => (
              <div key={i} style={{ fontSize: 13, lineHeight: 1.45, marginBottom: 20 }}>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontWeight: 700, fontStyle: "italic" }}
                />
                <Editable as="div" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontWeight: 700 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="eal-exp-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .eal-list { margin: 0 0 22px; padding-left: 20px; list-style: disc; }
        .eal-list > li { font-size: 13px; line-height: 1.5; margin-bottom: 4px; }
        .eal-exp-list { margin: 6px 0 0; padding-left: 20px; list-style: disc; }
        .eal-exp-list > li { font-size: 13px; line-height: 1.5; margin-bottom: 4px; }
      `}</style>
    </div>
  );
}

function RuleTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ marginBottom: 10, marginTop: mt || 0 }}>
      <Tag
        className="m-0"
        style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 18, color: NAVY }}
      >
        {text}
      </Tag>
      <div className="flex items-center" style={{ marginTop: 6 }}>
        <div className="flex-1" style={{ height: 2, background: NAVY, opacity: 0.85 }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: NAVY, marginLeft: 4 }} />
      </div>
    </div>
  );
}

function ContactRow({ icon, align = "center", children }) {
  return (
    <div className={align === "start" ? "flex items-start" : "flex items-center"} style={{ gap: 14 }}>
      <span style={{ color: INK, fontSize: 14, flex: "none", marginTop: align === "start" ? 2 : 0 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
