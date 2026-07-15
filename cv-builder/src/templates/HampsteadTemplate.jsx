import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Hampstead" — espresso + tan luxury CV. Gradient bar across the top,
// dark 300px sidebar (About Me / Education / Skills-with-bars / Language),
// white right column (centered name + role, 2x2 icon contact grid,
// vertical timeline for Experience, References).

const ESPRESSO = "#3d2b20";
const TAN = "#c9a87f";
const TAN_SOFT = "#b18a5e";
const SIDEBAR_TEXT = "#e9e2d8";
const SIDEBAR_MUTED = "#cfc5b7";
const SIDEBAR_HEADING = "#f0e7d9";
const BAR_TRACK = "#5a463a";
const HEADING = "#3d2b20";
const BODY = "#333";
const FONT = "'Lato', sans-serif";
const HEAD_FONT = "'Poppins', sans-serif";
const GRADIENT =
  "linear-gradient(90deg,#3d2b20 0%,#7a5c43 22%,#e8d9c5 58%,#c9a87f 80%,#8a6a4a 100%)";
const BAR_FILL =
  "linear-gradient(90deg,#8a6a4a,#c9a87f 80%,#e6d3ba)";

// Synthetic staggered skill percentages so the visual reads well without
// requiring a new data field. Deterministic per index: 92, 82, 88, 78,
// 85, 80, 90, ... — cycles through a small palette.
const SKILL_LEVELS = [92, 82, 88, 78, 85, 80, 90, 75, 84];

export default function HampsteadTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: BODY }}>
      {/* TOP GRADIENT BAR */}
      <div className="flex-none" style={{ height: 22, background: GRADIENT }} />

      <div className="flex flex-1">
        {/* LEFT DARK SIDEBAR */}
        <aside
          className="flex-none box-border"
          style={{ width: 300, background: ESPRESSO, color: SIDEBAR_TEXT, padding: "150px 30px 44px" }}
        >
          <SideTitle text="About Me" mt={0} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.7, color: SIDEBAR_MUTED, textAlign: "justify" }}
          />

          <SideTitle text="Education" mt={38} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 18 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 14, fontWeight: 700, color: "#f2ece2" }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontSize: 13.5, color: SIDEBAR_MUTED, marginTop: 6 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13.5, color: SIDEBAR_MUTED }}
              />
            </div>
          ))}

          <SideTitle text="Skills" mt={40} />
          <div className="flex flex-col" style={{ marginTop: 20, gap: 18 }}>
            {(data.skills || []).map((s, i) => {
              const pct = SKILL_LEVELS[i % SKILL_LEVELS.length];
              return (
                <div key={i} className="flex items-center">
                  <div className="flex-none" style={{ width: 150, fontSize: 14.5, color: SIDEBAR_TEXT }}>
                    {s}
                  </div>
                  <div className="flex-1" style={{ height: 7, borderRadius: 4, background: BAR_TRACK }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: BAR_FILL }} />
                  </div>
                </div>
              );
            })}
          </div>

          <SideTitle text="Language" mt={40} />
          <ul style={{ margin: "16px 0 0", paddingLeft: 20, fontSize: 15, lineHeight: 2.1, color: SIDEBAR_TEXT, listStyle: "disc" }}>
            {blocks.languages((l, i) => (
              <li key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT WHITE COLUMN */}
        <div className="flex-1 box-border" style={{ padding: "52px 44px 44px" }}>
          {/* NAME */}
          <div className="text-center">
            <Editable
              as="h1"
              value={data.name}
              onChange={(v) => update(["name"], v)}
              className="m-0 uppercase"
              style={{ fontFamily: HEAD_FONT, fontWeight: 800, fontSize: 54, letterSpacing: 3, color: ESPRESSO, lineHeight: 1 }}
            />
            <Editable
              as="div"
              value={data.role}
              onChange={(v) => update(["role"], v)}
              style={{ fontFamily: HEAD_FONT, fontWeight: 500, fontSize: 26, letterSpacing: 9, color: TAN_SOFT, marginTop: 10 }}
            />
          </div>

          {/* CONTACT 2×2 */}
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr", gap: "20px 24px", marginTop: 52 }}
          >
            <IconRow letter="✆">
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </IconRow>
            <IconRow letter="🌐">
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </IconRow>
            <IconRow letter="✉">
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </IconRow>
            <IconRow letter="●">
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </IconRow>
          </div>

          {/* EXPERIENCE TIMELINE */}
          <MainTitle text="Experience" mt={44} />
          <div style={{ position: "relative", marginTop: 22, paddingLeft: 34 }}>
            {/* rail */}
            <div style={{ position: "absolute", left: 9, top: 6, bottom: 24, width: 2, background: TAN }} />
            {blocks.experience((exp, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 22 }}>
                <span
                  style={{
                    position: "absolute",
                    left: -32,
                    top: 1,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    border: `2px solid ${TAN}`,
                    background: "#fff",
                  }}
                />
                <div className="flex justify-between items-baseline">
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontFamily: HEAD_FONT, fontSize: 16, fontWeight: 600, color: HEADING }}
                  />
                  <Editable
                    as="div"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    style={{ fontSize: 14, fontStyle: "italic", color: "#555" }}
                  />
                </div>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontSize: 14, color: BODY, marginTop: 3 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="hamp-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>

          {/* REFERENCES */}
          <MainTitle text="References" mt={40} />
          <div className="flex" style={{ gap: 30, marginTop: 18 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontFamily: HEAD_FONT, fontSize: 16, fontWeight: 700, color: HEADING }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 13.5, color: "#4a4a4a", marginTop: 2 }}
                />
                <div style={{ fontSize: 13.5, color: BODY, marginTop: 12 }}>
                  <b>Phone:</b>&nbsp;{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 13.5, color: BODY, marginTop: 5 }}>
                  <b>Email :</b>&nbsp;{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .hamp-list { margin: 8px 0 0; padding-left: 20px; list-style: disc; }
            .hamp-list > li { font-size: 13.5px; line-height: 1.6; color: #3a3a3a; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function SideTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 14, marginTop: mt }}>
      <Tag
        className="uppercase m-0"
        style={{ fontFamily: HEAD_FONT, fontSize: 20, fontWeight: 600, letterSpacing: 4, color: SIDEBAR_HEADING }}
      >
        {text}
      </Tag>
      <div className="flex-1" style={{ height: 1, background: TAN_SOFT }} />
    </div>
  );
}

function MainTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 16, marginTop: mt }}>
      <Tag
        className="uppercase m-0"
        style={{ fontFamily: HEAD_FONT, fontSize: 22, fontWeight: 600, letterSpacing: 3, color: ESPRESSO }}
      >
        {text}
      </Tag>
      <div className="flex-1" style={{ height: 1, background: TAN }} />
    </div>
  );
}

function IconRow({ letter, children }) {
  return (
    <div className="flex items-center" style={{ gap: 14 }}>
      <span
        className="flex-none flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: "50%", background: ESPRESSO, color: SIDEBAR_HEADING, fontSize: 14 }}
      >
        {letter}
      </span>
      <span style={{ fontSize: 14, color: BODY }}>{children}</span>
    </div>
  );
}
