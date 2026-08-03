import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Highgate" — grey chevron / timeline CV. Big centered name, then a
// chevron bar (white circle + chevron on top of a dark grey bar) for the
// role. Body is a two-column grid: left = Contact / Education (each date
// on its own chevron bar) / Reference, right = Experience (chevron date
// tabs with a vertical rail through them) / Skills (2-col dot list).

const DARK = "#1c1c1c";
const INK = "#2b2b2b";
const BAR = "#59595b";
const CHEV_BORDER = "#cfcfcf";
const CHEV_STROKE = "#5a5a5a";
const RAIL = "#d9d9d9";
const FONT = "'Poppins', sans-serif";

export default function HighgateTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: INK, padding: "40px 44px 44px", boxSizing: "border-box" }}>
      {/* NAME + ROLE CHEVRON BAR */}
      <div className="text-center">
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontWeight: 700, fontSize: 40, letterSpacing: 1, color: DARK, lineHeight: 1 }}
        />
      </div>
      <ChevronBar height={30}>
        <Editable
          as="span"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ color: "#fff", fontSize: 15, letterSpacing: 1 }}
        />
      </ChevronBar>

      {/* SUMMARY */}
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ textAlign: "justify", fontSize: 14, lineHeight: 1.5, color: INK, margin: "22px 0 0" }}
      />

      {/* BODY */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, marginTop: 32 }}>
        {/* LEFT */}
        <div>
          <SectionTitle text="Contact" />
          <div className="flex flex-col" style={{ marginTop: 16, gap: 14, fontSize: 12, lineHeight: 1.4 }}>
            <div>
              <div style={{ fontWeight: 600 }}>Mobile number:</div>
              <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Email:</div>
              <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Website:</div>
              <Editable as="div" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Address:</div>
              <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} />
            </div>
          </div>

          <SectionTitle text="Education" mt={32} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 16 : 20 }}>
              <ChevronBar height={26} fontSize={13}>
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} style={{ color: "#fff" }} />
              </ChevronBar>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, fontSize: 16, color: DARK, marginTop: 10, lineHeight: 1.2 }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontSize: 13, marginTop: 4 }}
              />
            </div>
          ))}

          <SectionTitle text="Reference" mt={32} />
          {blocks.references((r, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 14 : 16, fontSize: 13, lineHeight: 1.6 }}>
              <Editable as="div" value={r.name} onChange={(v) => update(["references", i, "name"], v)} style={{ fontWeight: 700 }} />
              <Editable as="div" value={r.role} onChange={(v) => update(["references", i, "role"], v)} />
              <Editable as="div" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div>
          <SectionTitle text="Experience" />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 16 : 12, position: "relative" }}>
              <ChevronBar height={28} width={210} fontSize={13}>
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} style={{ color: "#fff" }} />
              </ChevronBar>
              <div style={{ borderLeft: `2px solid ${RAIL}`, marginLeft: 14, paddingLeft: 22, paddingBottom: 10 }}>
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontWeight: 700, fontSize: 18, color: DARK, marginTop: 12 }}
                />
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontWeight: 700, fontSize: 12.5, marginTop: 4 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="hig-list"
                  bullet="•"
                />
              </div>
            </div>
          ))}

          <SectionTitle text="Skills" mt={30} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 22px", marginTop: 16, fontSize: 12.5 }}>
            {(data.skills || []).map((s, i) => (
              <div key={i} className="flex items-center" style={{ gap: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: INK, display: "inline-block" }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hig-list { margin: 8px 0 0 18px; padding-left: 0; list-style: disc; }
        .hig-list > li { font-size: 12px; line-height: 1.55; color: ${INK}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function SectionTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontWeight: 700, fontSize: 19, letterSpacing: 1.5, color: DARK, marginTop: mt || 0 }}
    >
      {text}
    </Tag>
  );
}

function ChevronBar({ children, height = 30, width, fontSize = 15 }) {
  return (
    <div className="flex items-center" style={{ marginTop: 12 }}>
      <div
        className="flex-none flex items-center justify-center"
        style={{
          width: height,
          height,
          borderRadius: "50%",
          background: "#fff",
          border: `1px solid ${CHEV_BORDER}`,
          zIndex: 2,
        }}
      >
        <svg width={height * 0.35} height={height * 0.35} viewBox="0 0 24 24" fill="none" stroke={CHEV_STROKE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
      <div
        className="flex items-center"
        style={{
          width: width || undefined,
          flex: width ? undefined : 1,
          height,
          background: BAR,
          marginLeft: -Math.round(height * 0.35),
          paddingLeft: 20,
          justifyContent: width ? "flex-start" : "center",
          color: "#fff",
          fontSize,
        }}
      >
        {children}
      </div>
    </div>
  );
}
