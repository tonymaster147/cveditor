import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Bath" — neat, well-spaced Web Dev CV. Big bold name in the top strip
// followed by a rule-bordered contact bar. Body splits into a cream
// (#faf4e6) left sidebar (Education / Skills / Language) and a white
// right column (Summary / Experience / References). Section titles are
// tracked-out caps ("SUMMARY:" etc.) in black.

const CREAM = "#faf4e6";
const RULE = "#cfcfcf";
const HEADING = "#2b2b2b";
const BODY = "#555";
const MUTED = "#777";
const FONT = "'Poppins', sans-serif";

export default function BathTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: "#3a3a3a" }}>
      {/* HEADER */}
      <div style={{ padding: "44px 48px 20px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 52, fontWeight: 800, letterSpacing: 1, color: HEADING, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 26, fontWeight: 400, color: BODY, marginTop: 6 }}
        />
      </div>

      {/* CONTACT BAR */}
      <div style={{ borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: "16px 48px" }}>
        <div style={{ fontSize: 15, color: "#333" }}>
          <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          <span>&nbsp;|&nbsp;&nbsp;</span>
          <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          <span>&nbsp;|&nbsp;</span>
          <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1">
        {/* LEFT — cream sidebar */}
        <aside
          className="flex-none box-border"
          style={{ width: 300, background: CREAM, padding: "36px 30px 50px" }}
        >
          <TrackedTitle text="Education:" mt={0} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: 18 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontWeight: 700, fontSize: 14, color: HEADING }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontWeight: 700, fontSize: 14, color: HEADING, marginTop: 2 }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 13.5, color: MUTED, marginTop: 8 }}
              />
            </div>
          ))}

          <TrackedTitle text="Skills:" mt={34} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="bath-list"
            bullet="•"
          />

          <TrackedTitle text="Language:" mt={34} />
          <ul className="bath-list">
            {blocks.languages((l, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="shrink-0">•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <style>{`
            .bath-list { margin: 16px 0 0; padding-left: 6px; list-style: none; }
            .bath-list > li { font-size: 13.5px; line-height: 2.1; color: ${BODY}; }
          `}</style>
        </aside>

        {/* RIGHT */}
        <div className="flex-1 box-border" style={{ padding: "36px 40px 50px" }}>
          <TrackedTitle text="Summary:" mt={0} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14, lineHeight: 1.75, color: BODY, margin: "16px 0 0" }}
          />

          <TrackedTitle text="Experience:" mt={32} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 22 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  className="uppercase"
                  style={{ fontWeight: 700, fontSize: 14, color: HEADING, letterSpacing: 0.5 }}
                />
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  className="uppercase"
                  style={{ fontWeight: 700, fontSize: 14, color: HEADING }}
                />
              </div>
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontWeight: 700, fontSize: 13.5, color: "#4a4a4a", marginTop: 8 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="bath-exp-list"
                bullet="•"
              />
            </div>
          ))}

          <TrackedTitle text="References:" mt={32} />
          <div className="flex" style={{ gap: 30, marginTop: 18 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  className="uppercase"
                  style={{ fontWeight: 700, fontSize: 14, color: HEADING }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontWeight: 700, fontSize: 13, color: "#4a4a4a", marginTop: 6 }}
                />
                <div style={{ fontSize: 12.5, color: BODY, marginTop: 12 }}>
                  <b>Phone:</b>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 12.5, color: BODY, marginTop: 6 }}>
                  <b>Email :</b>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .bath-exp-list { margin: 8px 0 0; padding-left: 6px; list-style: none; }
            .bath-exp-list > li { font-size: 13.5px; line-height: 1.65; color: ${BODY}; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function TrackedTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontWeight: 700, letterSpacing: 6, fontSize: 18, color: HEADING, marginTop: mt }}
    >
      {text}
    </Tag>
  );
}
