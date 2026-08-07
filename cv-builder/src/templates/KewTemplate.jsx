import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Kew" — editorial cream page in Jost. Big grey circle in the top-left
// with the name overlapping to its right, and a heavy black rule
// extending from the role subtitle. Contact appears in three columns
// after a left indent. Body: each section has a two-rule top (a heavy
// black rule under the 210px label column + a thin grey rule under the
// right content column) then label-on-left / content-on-right rows.

const DARK = "#111";
const CIRCLE = "#e4e4e6";
const RULE_SOFT = "#e2e2e2";
const PAGE = "#fdfbf6";
const FONT = "'Jost', sans-serif";

export default function KewTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ background: PAGE, fontFamily: FONT, color: DARK, padding: "42px 50px", boxSizing: "border-box" }}
    >
      {/* HEADER — circle + name */}
      <div style={{ position: "relative", minHeight: 110 }}>
        <div style={{ position: "absolute", left: -8, top: -14, width: 140, height: 140, borderRadius: "50%", background: CIRCLE }} />
        <div style={{ position: "relative", paddingTop: 16, paddingLeft: 26 }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontWeight: 700, fontSize: 38, letterSpacing: 1 }}
          />
          <div className="flex items-center" style={{ gap: 20, marginTop: 4 }}>
            <Editable
              as="span"
              value={data.role}
              onChange={(v) => update(["role"], v)}
              className="uppercase"
              style={{ fontWeight: 600, fontSize: 14, letterSpacing: 3, whiteSpace: "nowrap" }}
            />
            <span className="flex-1" style={{ borderTop: `2px solid ${DARK}` }} />
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div className="flex" style={{ gap: 22, margin: "22px 0 0 210px", fontSize: 13 }}>
        <div className="flex-1">
          <div style={{ fontWeight: 600 }}>Telephone</div>
          <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} style={{ marginTop: 4 }} />
        </div>
        <div style={{ flex: 1.2 }}>
          <div style={{ fontWeight: 600 }}>Mail</div>
          <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} style={{ marginTop: 4 }} />
        </div>
        <div className="flex-1">
          <div style={{ fontWeight: 600 }}>Location</div>
          <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} style={{ marginTop: 4 }} />
        </div>
      </div>

      {/* SECTIONS */}
      <div style={{ marginTop: 36 }}>
        <Row label="About Me">
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}
          />
        </Row>

        <Row label="Work Experience">
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 20, fontSize: 13.5 }}>
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
                className="kew-list"
                bullet="•"
              />
            </div>
          ))}
        </Row>

        <Row label="Academic Data">
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 16, fontSize: 13.5 }}>
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

        <Row label="Languages">
          <div className="flex" style={{ fontSize: 13.5 }}>
            {(data.languages || []).map((l, i) => (
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

        <Row label="Skills">
          <ul style={{ margin: 0, paddingLeft: 22, fontSize: 13.5, lineHeight: 1.55, listStyle: "disc" }}>
            {(data.skills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Row>
      </div>

      <style>{`
        .kew-list { margin: 6px 0 0; padding-left: 22px; list-style: disc; }
        .kew-list > li { line-height: 1.5; margin-bottom: 2px; }
      `}</style>
    </div>
  );
}

function Row({ label, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      {/* Double top-rule: heavy black on the left 210px, thin grey the rest. */}
      <div className="flex items-baseline">
        <div className="flex-none" style={{ width: 210 }}>
          <span style={{ borderTop: `4px solid ${DARK}`, display: "block", width: 200 }} />
        </div>
        <div className="flex-1" style={{ borderTop: `2px solid ${RULE_SOFT}` }} />
      </div>
      <div className="flex" style={{ padding: "16px 0 28px" }}>
        <div className="flex-none" style={{ width: 210, paddingRight: 24 }}>
          <Tag
            className="uppercase m-0"
            style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.5 }}
          >
            {label}
          </Tag>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
