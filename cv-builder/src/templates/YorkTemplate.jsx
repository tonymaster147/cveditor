import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "York" — minimal, timeless CV. Cream #f4f1ec background, centered
// Cormorant Garamond header (name in warm brown), Source Sans body.
// Two-column body: 230px left (Summary / Contact / Education / References)
// + flex right (Experience with brown timeline dots + 2-col Skills).

const CREAM = "#f4f1ec";
const BROWN = "#7a4a21";
const RULE = "#b09a80";
const BODY = "#333";
const SOFT = "#444";
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Source Sans 3', sans-serif";

export default function YorkTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const skillCols = chunkInto(data.skills || [], 2);

  return (
    <div
      className="cv-page"
      style={{ background: CREAM, fontFamily: SANS, color: BODY, padding: "56px 48px 48px", boxSizing: "border-box" }}
    >
      {/* HEADER */}
      <div className="text-center">
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 600, letterSpacing: 8, color: BROWN, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontFamily: SERIF, fontSize: 24, letterSpacing: 6, color: "#3a3a3a", marginTop: 12 }}
        />
      </div>

      {/* BODY */}
      <div className="flex" style={{ gap: 48, marginTop: 44 }}>
        {/* LEFT */}
        <div className="flex-none" style={{ width: 230 }}>
          <Section title="Summary" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13.5, lineHeight: 1.75, color: SOFT, margin: "20px 0 0", textAlign: "justify" }}
          />

          <Section title="Contact" mt={34} />
          <div className="flex flex-col" style={{ marginTop: 20, gap: 16, fontSize: 13.5, color: SOFT }}>
            <div className="flex items-center" style={{ gap: 14 }}>
              <span style={{ color: BROWN, fontSize: 16 }}>✆</span>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </div>
            <div className="flex items-center" style={{ gap: 14 }}>
              <span style={{ color: BROWN, fontSize: 16 }}>@</span>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </div>
            <div className="flex items-start" style={{ gap: 14 }}>
              <span style={{ color: BROWN, fontSize: 16 }}>●</span>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </div>
          </div>

          <Section title="Education" mt={34} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: 20 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 700, fontSize: 13.5, color: BODY }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 13, color: SOFT, marginTop: 6 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13, color: "#555", marginTop: 6, letterSpacing: 2 }}
              />
            </div>
          ))}

          <Section title="References" mt={34} />
          {blocks.references((r, i) => (
            <div key={i} style={{ marginTop: 16 }}>
              <Editable
                as="div"
                value={r.name}
                onChange={(v) => update(["references", i, "name"], v)}
                style={{ fontWeight: 700, fontSize: 13.5, color: BODY }}
              />
              <Editable
                as="div"
                value={r.role}
                onChange={(v) => update(["references", i, "role"], v)}
                style={{ fontSize: 13, color: SOFT, marginTop: 2 }}
              />
              <div style={{ fontSize: 12.5, color: BODY, marginTop: 8 }}>
                <b>Phone:</b>{" "}
                <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
              </div>
              <div style={{ fontSize: 12.5, color: BODY, marginTop: 4 }}>
                <b>Email :</b>{" "}
                <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <Section title="Experience" />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 22 : 24, position: "relative", paddingLeft: 26 }}>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: BROWN,
                }}
              />
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                style={{ fontWeight: 700, fontSize: 15, color: "#2b2b2b" }}
              />
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontSize: 14.5, color: BODY, marginTop: 4 }}
              />
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 14, fontStyle: "italic", color: SOFT, marginTop: 4 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="york-list"
                bullet="•"
              />
            </div>
          ))}

          <Section title="Skills" mt={32} />
          <div className="flex" style={{ gap: 30, marginTop: 18 }}>
            {skillCols.map((col, c) => (
              <ul
                key={c}
                className="flex-1"
                style={{ margin: 0, paddingLeft: 20, fontSize: 14.5, lineHeight: 1.9, color: BODY, listStyle: "disc" }}
              >
                {col.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .york-list { margin: 12px 0 0; padding-left: 6px; list-style: none; }
        .york-list > li { font-size: 14px; line-height: 1.55; color: #333; }
      `}</style>
    </div>
  );
}

function Section({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: BROWN, marginTop: mt || 0 }}>
        {title}
      </Tag>
      <div style={{ height: 1, background: RULE, marginTop: 12 }} />
    </>
  );
}

function chunkInto(arr, n) {
  const out = Array.from({ length: n }, () => []);
  const per = Math.ceil(arr.length / n);
  arr.forEach((item, i) => out[Math.min(Math.floor(i / per), n - 1)].push(item));
  return out;
}
