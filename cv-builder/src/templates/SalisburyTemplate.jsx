import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Salisbury" — minimal beige/timeline CV. Warm sand header, two columns:
// left (Profile + dark-circle icon contacts + Education / Expertise /
// Language, each heading in a beige inline pill), right (Work Experience
// on a timeline rail with fixed-width date columns, References).

const BEIGE = "#e6e3da";
const RAIL = "#cfcbc0";
const HEADING = "#2b2b2b";
const BODY = "#3d3d3d";
const SOFT = "#555";
const FONT = "'Poppins', sans-serif";

export default function SalisburyTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: BODY }}>
      {/* HEADER */}
      <div className="text-center" style={{ background: BEIGE, padding: "42px 30px 30px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 48, fontWeight: 800, letterSpacing: 4, color: HEADING, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 20, fontWeight: 500, letterSpacing: 6, color: BODY, marginTop: 10 }}
        />
      </div>

      {/* BODY */}
      <div className="flex" style={{ padding: "40px 40px 44px" }}>
        {/* LEFT */}
        <div className="flex-none box-border" style={{ width: 265, paddingRight: 32 }}>
          <IconTitle text="Profile">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={HEADING}>
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6z" />
            </svg>
          </IconTitle>
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13, lineHeight: 1.7, color: SOFT, margin: "14px 0 0", textAlign: "justify" }}
          />

          <div className="flex flex-col" style={{ marginTop: 32, gap: 16 }}>
            <DarkPill>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </DarkPill>
            <DarkPill>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </DarkPill>
            <DarkPill>
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </DarkPill>
            <DarkPill>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </DarkPill>
          </div>

          <PillTitle text="Education" mt={38} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 18 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 16, fontWeight: 700, color: HEADING }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontSize: 14, fontWeight: 600, color: BODY }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13.5, color: SOFT }}
              />
            </div>
          ))}

          <PillTitle text="Expertise" mt={38} />
          <div className="flex flex-col" style={{ marginTop: 20, gap: 14, fontSize: 14, color: BODY }}>
            {(data.skills || []).map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>

          <PillTitle text="Language" mt={38} />
          <div className="flex flex-col" style={{ marginTop: 20, gap: 14, fontSize: 14, color: BODY }}>
            {blocks.languages((l, i) => (
              <div key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 box-border">
          <IconTitle text="Work Experience">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={HEADING} strokeWidth="2">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </IconTitle>

          <div className="flex flex-col" style={{ marginTop: 22, gap: 22 }}>
            {blocks.experience((exp, i) => (
              <div key={i} className="flex" style={{ gap: 18 }}>
                <div
                  className="flex-none text-right"
                  style={{ width: 62, fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: HEADING, lineHeight: 1.5 }}
                >
                  <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                </div>
                <div style={{ borderLeft: `2px solid ${RAIL}`, paddingLeft: 20, paddingBottom: 6, flex: 1 }}>
                  <Editable
                    as="div"
                    value={exp.company}
                    onChange={(v) => update(["experience", i, "company"], v)}
                    style={{ fontSize: 17, fontWeight: 700, color: HEADING }}
                  />
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontSize: 13.5, color: SOFT, marginTop: 2 }}
                  />
                  <EditableList
                    items={exp.bullets}
                    onChange={(v) => update(["experience", i, "bullets"], v)}
                    className="sal-list"
                    bullet="•"
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 30 }}>
            <IconTitle text="References">
              <svg width="22" height="22" viewBox="0 0 24 24" fill={HEADING}>
                <path d="M4 4h7v15a3 3 0 0 0-3-1.5H4zm16 0h-7v15a3 3 0 0 1 3-1.5h4z" />
              </svg>
            </IconTitle>
            <div className="flex" style={{ gap: 28, marginTop: 18 }}>
              {blocks.references((r, i) => (
                <div key={i} className="flex-1">
                  <Editable
                    as="div"
                    value={r.name}
                    onChange={(v) => update(["references", i, "name"], v)}
                    style={{ fontSize: 16, fontWeight: 700, color: HEADING }}
                  />
                  <Editable
                    as="div"
                    value={r.role}
                    onChange={(v) => update(["references", i, "role"], v)}
                    style={{ fontSize: 14, color: BODY }}
                  />
                  <div style={{ fontSize: 12.5, marginTop: 10 }}>
                    <span style={{ fontWeight: 700, color: HEADING }}>Phone:</span>{" "}
                    <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  </div>
                  <div style={{ fontSize: 12.5, marginTop: 4 }}>
                    <span style={{ fontWeight: 700, color: HEADING }}>Email :</span>{" "}
                    <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            .sal-list { margin: 10px 0 0; padding-left: 20px; list-style: disc; }
            .sal-list > li { font-size: 13px; line-height: 1.5; color: #444; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function IconTitle({ text, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      {children}
      <Tag className="m-0" style={{ fontSize: 22, fontWeight: 700, color: HEADING }}>
        {text}
      </Tag>
    </div>
  );
}

function PillTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ marginTop: mt }}>
      <Tag
        className="inline-block"
        style={{ background: BEIGE, padding: "4px 44px 4px 4px", fontSize: 22, fontWeight: 700, color: HEADING }}
      >
        {text}
      </Tag>
    </div>
  );
}

function DarkPill({ children }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <div
        className="flex-none flex items-center justify-center"
        style={{ width: 30, height: 30, borderRadius: "50%", background: HEADING }}
      >
        <span style={{ color: "#fff", fontSize: 12 }}>●</span>
      </div>
      <span style={{ fontSize: 14 }}>{children}</span>
    </div>
  );
}
