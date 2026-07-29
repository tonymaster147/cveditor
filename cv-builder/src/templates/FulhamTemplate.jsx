import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Fulham" — mint-green CV. Vertical green bar at top-left next to name +
// contact split. Brief callout in a mint-tinted card. Two-column body:
// left = Work Experience (green-dot bullets) + Soft-skill dashed chips,
// right = Certificates (mapped from languages) + Education with timeline.

const MINT = "#7ed7a5";
const MINT_PALE = "#d8f0e0";
const MINT_INK = "#2f9e5f";
const DOT = "#3aab68";
const BORDER = "#cde6d6";
const DARK = "#111";
const INK = "#222";
const BODY = "#333";
const FONT = "'Mulish', sans-serif";
const HEAD = "'Poppins', sans-serif";

export default function FulhamTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ background: "#fff", fontFamily: FONT, color: INK, padding: "34px 40px 40px", boxSizing: "border-box" }}
    >
      {/* HEADER — green bar + name + contacts split */}
      <div className="flex" style={{ alignItems: "flex-start", gap: 20 }}>
        <div className="flex-none" style={{ width: 10, alignSelf: "stretch", minHeight: 110, background: MINT, borderRadius: 3 }} />
        <div className="flex-1 flex" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div>
            <Editable
              as="h1"
              value={data.name}
              onChange={(v) => update(["name"], v)}
              className="m-0 uppercase"
              style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 38, color: DARK, lineHeight: 1 }}
            />
            <div style={{ fontSize: 14, color: BODY, lineHeight: 1.6, marginTop: 8 }}>
              <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} />
              <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </div>
          </div>
          <div style={{ fontSize: 14, lineHeight: 2 }}>
            <div>
              <span style={{ fontWeight: 700 }}>Email:</span>&nbsp;{" "}
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </div>
            <div>
              <span style={{ fontWeight: 700 }}>Website:</span>&nbsp;{" "}
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </div>
          </div>
        </div>
      </div>

      {/* BRIEF CALLOUT */}
      <div style={{ background: MINT_PALE, borderRadius: 4, padding: "20px 22px", marginTop: 24 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 22, color: DARK, marginBottom: 6 }}>Brief</div>
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: INK }}
        />
      </div>

      {/* TWO COLUMNS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, marginTop: 30 }}>
        {/* LEFT — Work Experience + Soft Skills */}
        <div>
          <PillTitle text="Work Experience" accent />
          {blocks.experience((exp, i) => (
            <div key={i} className="flex" style={{ gap: 12, marginTop: i === 0 ? 18 : 22 }}>
              <span
                className="flex-none"
                style={{ width: 12, height: 12, borderRadius: "50%", background: DOT, marginTop: 6 }}
              />
              <div className="flex-1">
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 18, color: DARK }}
                />
                <div style={{ fontSize: 13, color: BODY, marginTop: 3 }}>
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                  <span> | </span>
                  <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                </div>
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="ful-list"
                  bullet="•"
                />
              </div>
            </div>
          ))}

          {/* SOFT SKILLS card — reuse `languages` as dashed chip items */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, padding: "20px 20px 22px", marginTop: 30 }}>
            <PillTitle text="Soft Skills" />
            <div className="flex flex-wrap" style={{ gap: 10, marginTop: 16 }}>
              {(data.languages || []).map((l, i) => (
                <span
                  key={i}
                  style={{ border: "1.5px dashed #444", borderRadius: 20, padding: "6px 14px", fontWeight: 700, fontSize: 12 }}
                >
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Certificates (skills reused) + Education */}
        <div>
          <PillTitle text="Certificates" accent />
          <div style={{ marginTop: 18 }}>
            {(data.skills || []).slice(0, 6).map((s, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 16 }}>
                <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15, color: DARK, lineHeight: 1.25 }}>{s}</div>
              </div>
            ))}
          </div>

          <PillTitle text="Education Summary" accent mt={32} />
          <div style={{ marginTop: 18 }}>
            {blocks.education((ed, i) => {
              const isLast = i === (data.education || []).length - 1;
              return (
              <div key={i} className="flex" style={{ gap: 12, marginTop: i === 0 ? 0 : 22 }}>
                <div className="flex-none flex flex-col items-center" style={{ paddingTop: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: DOT }} />
                  {!isLast && (
                    <span style={{ width: 2, flex: 1, background: DOT, marginTop: 4, minHeight: 30 }} />
                  )}
                </div>
                <div className="flex-1">
                  <Editable
                    as="div"
                    value={ed.degree}
                    onChange={(v) => update(["education", i, "degree"], v)}
                    style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 17, color: DARK, lineHeight: 1.2 }}
                  />
                  <div style={{ fontSize: 13, color: BODY, marginTop: 4 }}>
                    <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                    <span> | </span>
                    <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .ful-list { margin: 8px 0 0 18px; padding-left: 0; list-style: disc; }
        .ful-list > li { font-size: 13px; line-height: 1.5; color: ${INK}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function PillTitle({ text, accent, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ marginTop: mt || 0 }}>
      <Tag
        className="inline-block"
        style={{
          background: MINT_PALE,
          padding: "5px 14px",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 19,
          color: accent ? MINT_INK : DARK,
        }}
      >
        {text}
      </Tag>
    </div>
  );
}
