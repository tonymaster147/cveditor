import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Holborn" — classical serif CV in EB Garamond. A soft grey top strip
// with a centered serif ELSIE MURRAY and tracked-out CERTIFIED NURSE
// subtitle. A thin black rule under the header runs across, then a
// 2-col layout separated by a vertical rule: dark-circle icon contacts
// + Summary at the top, Education + Skills + Language Skills on the
// left below, Work Experience on the right below.

const CREAM = "#ececed";
const DARK = "#3a3a3a";
const NAME_INK = "#4a4d4f";
const INK = "#2e2e2e";
const FADE = "#9a9a9a";
const FONT = "'EB Garamond', Georgia, serif";

export default function HolbornTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: FONT, color: DARK, position: "relative" }}>
      {/* HEADER */}
      <div style={{ position: "relative", height: 150 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: CREAM }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontSize: 50, fontWeight: 500, letterSpacing: "0.09em", color: NAME_INK, lineHeight: 1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="uppercase"
            style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.4em", color: NAME_INK, marginTop: 14 }}
          />
        </div>
      </div>

      <div style={{ padding: "0 36px 40px" }}>
        <div style={{ borderTop: `1.5px solid ${DARK}` }} />

        {/* TOP ROW: contact / summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr" }}>
          <div style={{ padding: "26px 30px 26px 6px", display: "flex", flexDirection: "column", gap: 18 }}>
            <IconLine icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconLine>
            <IconLine icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconLine>
            <IconLine icon="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconLine>
          </div>
          <div style={{ padding: "26px 0 26px 32px", borderLeft: `1.5px solid ${DARK}` }}>
            <SectionTitle text="Summary" />
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ fontSize: 14.5, lineHeight: 1.5, margin: "12px 0 0", color: DARK }}
            />
          </div>
        </div>

        <div style={{ borderTop: `1.5px solid ${DARK}` }} />

        {/* MAIN ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr" }}>
          {/* LEFT */}
          <div style={{ padding: "26px 30px 0 6px" }}>
            <SectionTitle text="Education" />
            <div style={{ marginTop: 14 }}>
              {blocks.education((ed, i) => (
                <div key={i} style={{ marginTop: i === 0 ? 0 : 18 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>
                    <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                    {" ("}
                    <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                    {")"}
                  </div>
                  <Editable
                    as="p"
                    value={ed.degree}
                    onChange={(v) => update(["education", i, "degree"], v)}
                    multiline
                    style={{ fontSize: 14.5, lineHeight: 1.4, margin: "4px 0 0", color: DARK }}
                  />
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${FADE}`, margin: "24px 0 0", width: "88%" }} />

            <div style={{ marginTop: 24 }}>
              <SectionTitle text="Skills" />
            </div>
            <ul style={{ listStyle: "circle", paddingLeft: 24, margin: "12px 0 0", fontSize: 14.5, fontWeight: 700, color: INK, lineHeight: 1.75 }}>
              {(data.skills || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <div style={{ borderTop: `1px solid ${FADE}`, margin: "24px 0 0", width: "88%" }} />

            <div style={{ marginTop: 24 }}>
              <SectionTitle text="Language Skills" />
            </div>
            <ul style={{ listStyle: "circle", paddingLeft: 24, margin: "12px 0 0", fontSize: 14.5, fontWeight: 700, color: INK, lineHeight: 1.9 }}>
              {blocks.languages((l, i) => (
                <li key={i}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div style={{ padding: "26px 0 0 32px", borderLeft: `1.5px solid ${DARK}` }}>
            <SectionTitle text="Work Experience" />
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 14 : 18 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                  {" ("}
                  <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                  {")"}
                </div>
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontSize: 14.5, marginTop: 2, color: DARK }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="hol-list"
                  bullet="○"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hol-list { list-style: circle; padding-left: 26px; margin: 6px 0 0; }
        .hol-list > li { font-size: 14.5px; line-height: 1.4; color: ${DARK}; margin-bottom: 4px; }
      `}</style>
    </div>
  );
}

function SectionTitle({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", color: INK }}
    >
      {text}
    </Tag>
  );
}

function IconLine({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 14 }}>
      <span
        className="flex items-center justify-center flex-none"
        style={{ width: 28, height: 28, borderRadius: "50%", background: DARK, color: "#fff", fontSize: 12 }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 14.5 }}>{children}</span>
    </div>
  );
}
