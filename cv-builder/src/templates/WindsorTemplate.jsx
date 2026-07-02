import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Windsor" — prestigious, classic Marketing Manager CV. Deep brown block
// header with tracked-out white name and role, then a two-column body:
// narrow left (Contact / Education / Skills / Language) + wide right
// (About Me / Experience / References). Section headings use a thin grey
// rule underneath.

const BROWN = "#8b4c10";
const RULE = "#555";
const BODY = "#333";
const HEADING = "#2b2b2b";
const FONT = "'Poppins', sans-serif";

export default function WindsorTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: "#2b2b2b" }}>
      {/* HEADER BLOCK */}
      <div className="text-center" style={{ background: BROWN, padding: "82px 40px 60px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 56, fontWeight: 700, letterSpacing: 10, color: "#ffffff", lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontSize: 23, fontWeight: 400, letterSpacing: 2, color: "#ffffff", marginTop: 18 }}
        />
      </div>

      {/* BODY */}
      <div className="flex box-border" style={{ gap: 44, padding: "38px 40px 48px" }}>
        {/* LEFT */}
        <div className="flex-none" style={{ width: 240 }}>
          <Section title="Contact" />
          <div className="flex flex-col" style={{ marginTop: 18, gap: 14, fontSize: 13, color: BODY }}>
            <div className="flex" style={{ gap: 10 }}>
              <span style={{ fontWeight: 700, flex: "none" }}>Phone:</span>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </div>
            <div className="flex" style={{ gap: 10 }}>
              <span style={{ fontWeight: 700, flex: "none" }}>E-Mail:</span>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </div>
            <div className="flex" style={{ gap: 10 }}>
              <span style={{ fontWeight: 700, flex: "none" }}>Address:</span>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </div>
          </div>

          <Section title="Education" mt={36} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 20 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, fontSize: 14, color: HEADING }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontSize: 14, color: BODY, marginTop: 8 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 14, color: BODY, marginTop: 2 }}
              />
            </div>
          ))}

          <Section title="Skills" mt={36} />
          <div className="flex flex-col" style={{ marginTop: 16, gap: 12, fontSize: 14, color: BODY }}>
            {(data.skills || []).map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>

          <Section title="Language" mt={36} />
          <ul style={{ margin: "16px 0 0", paddingLeft: 20, fontSize: 14, lineHeight: 2, color: BODY }}>
            {blocks.languages((l, i) => (
              <li key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <Section title="About Me" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14.5, lineHeight: 1.65, color: BODY, margin: "16px 0 0", textAlign: "justify" }}
          />

          <Section title="Experience" mt={32} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 20 : 22 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontWeight: 700, fontSize: 16, color: HEADING }}
                />
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontSize: 14, color: BODY }}
                />
              </div>
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontSize: 14.5, color: BODY, marginTop: 6 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="wsr-list"
                bullet="•"
              />
            </div>
          ))}

          <Section title="References" mt={32} />
          <div className="flex" style={{ gap: 30, marginTop: 18 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontWeight: 700, fontSize: 15, color: HEADING }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 13.5, color: "#444", marginTop: 4 }}
                />
                <div style={{ fontSize: 13, color: BODY, marginTop: 10 }}>
                  <b>Phone:</b>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 13, color: BODY, marginTop: 6 }}>
                  <b>Email :</b>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .wsr-list { margin: 8px 0 0; padding-left: 6px; list-style: none; }
        .wsr-list > li { font-size: 13px; line-height: 1.55; color: #444; }
      `}</style>
    </div>
  );
}

function Section({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag style={{ fontSize: 22, fontWeight: 600, color: HEADING, marginTop: mt || 0 }}>
        {title}
      </Tag>
      <div style={{ height: 1, background: RULE, marginTop: 10 }} />
    </>
  );
}
