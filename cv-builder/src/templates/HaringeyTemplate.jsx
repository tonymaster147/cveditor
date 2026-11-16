import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Haringey" — single column. Widely tracked pink Montserrat name and
// grey spaced role, right-aligned contact stack split by pink hairlines.
// Pink section titles trailed by a full-width pink rule; Open Sans body
// with italic bullet lists and italic right-aligned dates.

const PINK = "#e73177";
const TEXT = "#333";
const HEAD = "'Montserrat', sans-serif";
const BODY = "'Open Sans', sans-serif";

export default function HaringeyTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const skills = data.skills || [];
  const half = Math.ceil(skills.length / 2);

  return (
    <div
      className="cv-page"
      style={{ background: "#fff", overflow: "hidden", padding: "54px 58px 60px", fontFamily: BODY, color: "#2f2f2f" }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 30 }}>
        <div style={{ paddingTop: 6, minWidth: 0 }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: PINK, lineHeight: 1.1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="uppercase"
            style={{ fontFamily: HEAD, fontWeight: 400, fontSize: 15, letterSpacing: 3, color: "#8a8a8a", marginTop: 10, lineHeight: 1.45 }}
          />
        </div>
        <div style={{ width: 240, flexShrink: 0, textAlign: "right", fontSize: 14, color: TEXT, wordBreak: "break-word" }}>
          <div style={{ paddingBottom: 12 }}>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </div>
          <div style={{ borderTop: `1.5px solid ${PINK}`, padding: "12px 0" }}>
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </div>
          <div style={{ borderTop: `1.5px solid ${PINK}`, paddingTop: 12 }}>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </div>
        </div>
      </div>

      <Head text="Summary" mt={36} />
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ margin: 0, fontSize: 14, lineHeight: 1.7, textAlign: "justify", color: "#3a3a3a" }}
      />

      <Head text="Experience" mt={22} />
      {blocks.experience((exp, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <Row
            left={
              <>
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                {" - "}
                <Editable as="span" value={exp.location} onChange={(v) => update(["experience", i, "location"], v)} />
              </>
            }
            right={
              <>
                (<Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />)
              </>
            }
          />
          <Editable
            as="div"
            value={exp.title}
            onChange={(v) => update(["experience", i, "title"], v)}
            style={{ fontSize: 14, marginTop: 3, color: TEXT }}
          />
          <EditableList
            items={exp.bullets}
            onChange={(v) => update(["experience", i, "bullets"], v)}
            className="har-list"
            bullet="•"
          />
        </div>
      ))}

      <Head text="Education" mt={22} />
      {blocks.education((ed, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <Row
            left={
              <>
                <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} /> (
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />)
              </>
            }
            right={<Editable as="span" value={ed.location} onChange={(v) => update(["education", i, "location"], v)} />}
          />
          <Editable
            as="div"
            value={ed.degree}
            onChange={(v) => update(["education", i, "degree"], v)}
            style={{ fontSize: 14, marginTop: 3, color: TEXT }}
          />
        </div>
      ))}

      <Head text="Certification" mt={22} />
      <ul className="har-list">
        {blocks.courses((c, i) => (
          <li key={i}>
            <Editable as="span" value={c.title} onChange={(v) => update(["courses", i, "title"], v)} />
          </li>
        ))}
      </ul>

      <Head text="Skills" mt={22} />
      <div style={{ display: "flex", gap: 40 }}>
        <ul className="har-list" style={{ flex: 1 }}>
          {skills.slice(0, half).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <ul className="har-list" style={{ flex: 1 }}>
          {skills.slice(half).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <style>{`
        .har-list { margin: 8px 0 0; padding: 0; list-style: none; }
        .har-list li { font-style: italic; font-size: 14px; line-height: 1.5; margin-bottom: 7px; color: #2f2f2f; }
        .har-list li:not(.group):not(.no-export) { position: relative; padding-left: 16px; }
        .har-list li:not(.group):not(.no-export):before { content: "•"; position: absolute; left: 2px; font-style: normal; }
      `}</style>
    </div>
  );
}

function Head({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: mt, marginBottom: 12 }}>
      <Tag
        className="m-0 uppercase"
        style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 16, letterSpacing: 1, color: PINK }}
      >
        {text}
      </Tag>
      <div style={{ flex: 1, height: 1.5, background: PINK }} />
    </div>
  );
}

function Row({ left, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
      <div
        className="uppercase"
        style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 13.5, letterSpacing: 0.4, color: "#222" }}
      >
        {left}
      </div>
      <div style={{ fontStyle: "italic", fontSize: 14, color: TEXT, whiteSpace: "nowrap" }}>{right}</div>
    </div>
  );
}
