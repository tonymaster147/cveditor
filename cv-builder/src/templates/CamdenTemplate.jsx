import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Camden" — grey header block with dark-circle icon contacts, two-column
// body with a left sidebar (About Me / Education / Skills with tiny
// rating bars) and a right main column (Work Experience on a vertical
// timeline, Expertise 3-col grid, Reference 3-col grid). Poppins.

const HEADER_BG = "#ececec";
const DARK = "#1c1c1c";
const RULE = "#c9c9c9";
const FONT = "'Poppins', sans-serif";

// Synthetic staggered widths for the little skill "level" bars.
const BAR_WIDTHS = [58, 46, 52, 40, 36, 50, 44, 42];

export default function CamdenTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: DARK, background: "#fff" }}>
      {/* HEADER */}
      <div style={{ background: HEADER_BG, padding: "36px 44px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontWeight: 700, fontSize: 34, letterSpacing: 0.5, lineHeight: 1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontSize: 16, color: "#3a3a3a", marginTop: 6, fontWeight: 400 }}
          />
        </div>
        <div className="flex flex-col" style={{ gap: 10, fontSize: 12, marginTop: 4 }}>
          <IconRow letter="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconRow>
          <IconRow letter="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconRow>
          <IconRow letter="🌐"><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></IconRow>
          <IconRow letter="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconRow>
        </div>
      </div>
      <div style={{ height: 1, background: RULE, margin: "0 44px" }} />

      {/* BODY */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", padding: "30px 44px 40px" }}>
        {/* LEFT */}
        <div style={{ paddingRight: 26, borderRight: `1px solid ${RULE}` }}>
          <SideTitle text="About Me" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ textAlign: "justify", fontSize: 11.5, lineHeight: 1.55, margin: 0 }}
          />

          <SideTitle text="Education" mt={30} />
          <div className="flex flex-col" style={{ gap: 16, fontSize: 11.5, lineHeight: 1.5 }}>
            {blocks.education((ed, i) => (
              <div key={i}>
                <Editable as="div" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} className="uppercase" style={{ fontWeight: 600 }} />
                <Editable as="div" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                <Editable as="div" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            ))}
          </div>

          <SideTitle text="Skills" mt={30} />
          <div className="flex flex-col" style={{ gap: 10, fontSize: 11.5 }}>
            {(data.skills || []).map((s, i) => (
              <div key={i} className="flex items-center" style={{ justifyContent: "space-between", gap: 10 }}>
                <span className="flex items-center" style={{ gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: DARK }} />
                  {s}
                </span>
                <span
                  style={{
                    width: BAR_WIDTHS[i % BAR_WIDTHS.length],
                    height: 3,
                    background: "#c4c4c4",
                    borderRadius: 2,
                    flex: "none",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ paddingLeft: 30 }}>
          <SideTitle text="Work Experience" />
          <div style={{ position: "relative", paddingLeft: 22 }}>
            <div style={{ position: "absolute", left: 4, top: 6, bottom: 8, width: 2, background: DARK }} />
            {blocks.experience((exp, i) => (
              <div key={i} style={{ position: "relative", marginBottom: 20 }}>
                <div style={{ position: "absolute", left: -22, top: 4, width: 10, height: 10, borderRadius: "50%", background: DARK }} />
                <div className="flex" style={{ gap: 16 }}>
                  <Editable
                    as="div"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    className="uppercase"
                    style={{ fontWeight: 700, fontSize: 12, width: 82, flexShrink: 0 }}
                  />
                  <div>
                    <Editable as="div" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} className="uppercase" style={{ fontSize: 12 }} />
                    <Editable as="div" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} style={{ fontSize: 12 }} />
                  </div>
                </div>
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="cam-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: RULE, margin: "24px 0 20px" }} />

          <SideTitle text="Expertise" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 16px", fontSize: 11.5 }}>
            {blocks.languages((l, i) => (
              <div key={i} className="flex items-center" style={{ gap: 8 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: DARK }} />
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: RULE, margin: "22px 0 20px" }} />

          <SideTitle text="Reference" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 11, lineHeight: 1.5 }}>
            {blocks.references((r, i) => (
              <div key={i}>
                <Editable as="div" value={r.name} onChange={(v) => update(["references", i, "name"], v)} style={{ fontWeight: 700, fontSize: 12 }} />
                <Editable as="div" value={r.role} onChange={(v) => update(["references", i, "role"], v)} style={{ marginTop: 2 }} />
                <div className="flex items-center" style={{ gap: 6, marginTop: 6 }}>
                  <span>✆</span>
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div className="flex items-center" style={{ gap: 6 }}>
                  <span>✉</span>
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cam-list { margin: 8px 0 0 100px; padding-left: 18px; list-style: disc; }
        .cam-list > li { font-size: 11.5px; line-height: 1.5; color: ${DARK}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function SideTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ marginTop: mt || 0, marginBottom: 14 }}>
      <Tag className="uppercase" style={{ fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
        {text}
      </Tag>
      <div style={{ width: 28, height: 2, background: DARK, marginTop: 6 }} />
    </div>
  );
}

function IconRow({ letter, children }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span
        className="flex-none flex items-center justify-center"
        style={{ width: 22, height: 22, borderRadius: "50%", background: DARK, color: "#fff", fontSize: 10 }}
      >
        {letter}
      </span>
      {children}
    </div>
  );
}
