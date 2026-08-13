import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Clapham" — clean corporate CV. Thin navy strip along the top, then a
// header row (Poppins name + blue role on the left, location on the
// right) divided by a hairline. Body: main column (About / Experience
// blocks with dates on the right, blue company sub-heading) + a light
// grey sidebar (Contact / Skills as bordered pill tags / Education /
// Languages / References). Poppins for headings, Open Sans body.

const NAVY = "#1b2a41";
const BLUE = "#3b6fe3";
const MUTED = "#98a2b0";
const RULE = "#e3e7ec";
const SIDEBAR_BG = "#f6f8fa";
const INK = "#4c5866";
const DARK_INK = "#2b3644";
const PILL_BORDER = "#e2e7ee";
const PILL_TEXT = "#3c4654";
const SANS = "'Open Sans', sans-serif";
const HEAD = "'Poppins', sans-serif";

export default function ClaphamTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: SANS, color: INK, background: "#fff", borderTop: `3px solid ${NAVY}` }}>
      {/* HEADER */}
      <div
        className="flex"
        style={{ justifyContent: "space-between", alignItems: "flex-end", padding: "26px 32px 18px", borderBottom: `1px solid ${RULE}`, gap: 20 }}
      >
        <div>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 800, letterSpacing: 1, color: NAVY, lineHeight: 1.1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontFamily: HEAD, fontSize: 17, fontWeight: 500, color: BLUE, marginTop: 4 }}
          />
        </div>
        <Editable
          as="span"
          value={data.location}
          onChange={(v) => update(["location"], v)}
          style={{ fontSize: 12, color: DARK_INK, paddingBottom: 6 }}
        />
      </div>

      {/* BODY */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px" }}>
        {/* MAIN */}
        <div style={{ padding: "26px 26px 40px 32px" }}>
          <MainTitle icon="●" text="About" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ margin: "12px 0 0", fontSize: 12, lineHeight: 1.7, textAlign: "justify", color: INK }}
          />

          <MainTitle icon="▤" text="Experience" mt={28} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 14 : 22 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, color: NAVY }}
                />
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  className="uppercase"
                  style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: MUTED }}
                />
              </div>
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                className="uppercase"
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: BLUE, marginTop: 2 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="cla-list"
                bullet="•"
              />
            </div>
          ))}

          <style>{`
            .cla-list { margin: 8px 0 0; padding-left: 20px; list-style: disc; }
            .cla-list > li { font-size: 12px; line-height: 1.55; color: ${INK}; margin-bottom: 4px; }
          `}</style>
        </div>

        {/* SIDEBAR */}
        <aside style={{ background: SIDEBAR_BG, padding: "26px 22px 34px" }}>
          <MainTitle icon="●" text="Contact" />
          <div className="flex flex-col" style={{ gap: 10, marginTop: 14, fontSize: 12, color: DARK_INK }}>
            <SideRow color={BLUE}><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></SideRow>
            <SideRow color={BLUE}><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></SideRow>
            <SideRow color={BLUE}><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></SideRow>
          </div>

          <MainTitle icon="⌕" text="Skills" mt={26} />
          <div className="flex flex-wrap" style={{ gap: 8, marginTop: 14 }}>
            {(data.skills || []).map((s, i) => (
              <span
                key={i}
                style={{
                  background: "#fff",
                  border: `1px solid ${PILL_BORDER}`,
                  borderRadius: 6,
                  padding: "5px 10px",
                  fontSize: 11,
                  color: PILL_TEXT,
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <MainTitle icon="▤" text="Education" mt={26} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 12 : 14 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontFamily: HEAD, fontSize: 13, fontWeight: 700, color: NAVY }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontSize: 12, color: INK, marginTop: 2 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 12, fontWeight: 700, color: BLUE, marginTop: 2 }}
              />
            </div>
          ))}

          <MainTitle icon="◐" text="Languages" mt={26} />
          <div className="flex flex-col" style={{ gap: 6, marginTop: 12, fontSize: 12, color: DARK_INK }}>
            {blocks.languages((l, i) => (
              <div key={i}>
                <strong style={{ color: NAVY }}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />:
                </strong>{" "}
                {l.level ? (
                  <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
                ) : (
                  "Fluent"
                )}
              </div>
            ))}
          </div>

          <MainTitle icon="✎" text="References" mt={26} />
          {blocks.references((r, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 12 : 14 }}>
              <Editable
                as="div"
                value={r.name}
                onChange={(v) => update(["references", i, "name"], v)}
                style={{ fontFamily: HEAD, fontSize: 13, fontWeight: 700, color: NAVY }}
              />
              <Editable
                as="div"
                value={r.role}
                onChange={(v) => update(["references", i, "role"], v)}
                style={{ fontSize: 12, color: DARK_INK, marginTop: 1 }}
              />
              <div style={{ fontSize: 10.5, color: INK, marginTop: 3 }}>
                <strong style={{ color: DARK_INK }}>Phone:</strong>{" "}
                <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
              </div>
              <div style={{ fontSize: 10.5, color: INK }}>
                <strong style={{ color: DARK_INK }}>Email:</strong>{" "}
                <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function MainTitle({ icon, text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 8, color: MUTED, marginTop: mt || 0 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <Tag
        className="uppercase m-0"
        style={{ fontFamily: HEAD, fontSize: 11, fontWeight: 600, letterSpacing: 1.8, color: MUTED }}
      >
        {text}
      </Tag>
    </div>
  );
}

function SideRow({ color, children }) {
  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      <span style={{ color, fontSize: 12 }}>●</span>
      {children}
    </div>
  );
}
