import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Pimlico" — pure minimal centered CV in Jost. Centered name + heavily
// tracked-out role, a thin horizontal rule, two-column contact row, then
// a stack of label/content rows separated by 1px black rules. Each row's
// left side (170px) is the section label right-aligned, and the right
// side holds the content. Editorial, formal.

const DARK = "#111";
const FONT = "'Jost', sans-serif";

export default function PimlicoTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const skillCols = chunkInto(data.skills || [], 2);
  const langs = data.languages || [];

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: DARK, padding: "42px 56px", boxSizing: "border-box" }}>
      {/* HEADER */}
      <div className="text-center">
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontWeight: 600, fontSize: 32, letterSpacing: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ fontWeight: 400, fontSize: 16, letterSpacing: 7, marginTop: 6 }}
        />
      </div>
      <div style={{ borderTop: `1px solid ${DARK}`, margin: "20px 32px 0" }} />

      {/* CONTACT */}
      <div className="flex" style={{ gap: 44, margin: "24px 60px 0", fontSize: 14 }}>
        <div className="flex-1 flex flex-col" style={{ gap: 12 }}>
          <IconLine icon="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconLine>
          <IconLine icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconLine>
        </div>
        <div className="flex flex-col" style={{ flex: 1.15, gap: 12 }}>
          <IconLine icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconLine>
          <IconLine icon="🌐"><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></IconLine>
        </div>
      </div>

      {/* SECTIONS */}
      <div style={{ marginTop: 34 }}>
        <Row label="About Me">
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}
          />
        </Row>

        <Row label={<>Work<br />Experience</>} top>
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 18, fontSize: 14 }}>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                style={{ fontWeight: 600 }}
              />
              <div>
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                <span> | </span>
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
              </div>
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="pim-list"
                bullet="•"
              />
            </div>
          ))}
        </Row>

        <Row label="Academic Data" top>
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 16, fontSize: 14 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 600 }}
              />
              <div>
                <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                <span> | </span>
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            </div>
          ))}
        </Row>

        <Row label="Skills" top>
          <div className="flex" style={{ fontSize: 14 }}>
            {skillCols.map((col, c) => (
              <ul key={c} className="flex-1" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6, listStyle: "disc" }}>
                {col.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ))}
          </div>
        </Row>

        <Row label="Languages" top>
          <div className="flex" style={{ fontSize: 14 }}>
            {langs.map((l, i) => (
              <div key={i} className="flex-1">
                <span style={{ fontWeight: 600 }}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />:
                </span>
                <br />
                {l.level ? (
                  <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
                ) : (
                  "Fluent."
                )}
              </div>
            ))}
          </div>
        </Row>
      </div>

      <style>{`
        .pim-list { margin: 8px 0 0; padding-left: 22px; list-style: disc; }
        .pim-list > li { line-height: 1.5; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function Row({ label, children, top }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex" style={{ padding: "22px 0", borderTop: top ? `1px solid ${DARK}` : "none" }}>
      <div className="flex-none text-right" style={{ width: 170, paddingRight: 30 }}>
        <Tag
          className="uppercase m-0"
          style={{ fontWeight: 600, fontSize: 15, letterSpacing: 1, lineHeight: 1.25 }}
        >
          {label}
        </Tag>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function IconLine({ icon, children }) {
  return (
    <span className="inline-flex items-center" style={{ gap: 12 }}>
      <span style={{ color: DARK, fontSize: 13 }}>{icon}</span>
      {children}
    </span>
  );
}

function chunkInto(arr, n) {
  const out = Array.from({ length: n }, () => []);
  const per = Math.max(1, Math.ceil(arr.length / n));
  arr.forEach((item, i) => out[Math.min(Math.floor(i / per), n - 1)].push(item));
  return out;
}
