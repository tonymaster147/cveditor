import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Manchester" — contemporary, corporate accounting resume. Deep navy
// header with widely tracked-out name and a pipe-separated contact line
// in soft blue-grey. Body is a single column with navy section titles +
// full-width rules. Education, Skills+Awards render two-up.

const NAVY = "#123047";
const NAVY_SOFT = "#dfe4e8";
const BODY = "#333";
const HEADING = "#1a1a1a";
const FONT = "'Poppins', sans-serif";

export default function ManchesterTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const skillCols = chunkInto(data.skills || [], 2);
  const eduPair = (data.education || []).slice(0, 2);
  const eduRest = (data.education || []).slice(2);

  return (
    <div className="cv-page" style={{ fontFamily: FONT, color: "#2b2b2b" }}>
      {/* HEADER */}
      <div className="text-center" style={{ background: NAVY, padding: "56px 40px 40px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 52, fontWeight: 400, letterSpacing: 14, color: "#ffffff", lineHeight: 1 }}
        />
        <div style={{ fontSize: 14.5, color: NAVY_SOFT, marginTop: 22 }}>
          <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "34px 44px 44px" }}>
        <Section title="Summary" mt={0} />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontSize: 13.5, lineHeight: 1.65, color: BODY, margin: "14px 0 0", textAlign: "justify" }}
        />

        <Section title="Work Experience" />
        {blocks.experience((exp, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 16 : 18 }}>
            <Editable
              as="div"
              value={exp.title}
              onChange={(v) => update(["experience", i, "title"], v)}
              style={{ fontWeight: 700, fontSize: 16, color: HEADING }}
            />
            <div style={{ fontSize: 14, color: BODY, marginTop: 4 }}>
              <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
            </div>
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="mnc-list"
              bullet="•"
            />
          </div>
        ))}

        <Section title="Education" />
        <div className="flex" style={{ gap: 40, marginTop: 16 }}>
          {eduPair.map((ed, ii) => {
            const i = ii; // index into data.education (matches slice(0,2))
            return (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontWeight: 700, fontSize: 15, color: HEADING }}
                />
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  style={{ fontSize: 14, color: BODY, marginTop: 4 }}
                />
                <Editable
                  as="div"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  style={{ fontWeight: 700, fontSize: 14, color: HEADING, marginTop: 10 }}
                />
              </div>
            );
          })}
        </div>
        {eduRest.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {eduRest.map((ed, offset) => {
              const i = offset + 2;
              return (
                <div key={i} style={{ marginTop: 12 }}>
                  <Editable
                    as="div"
                    value={ed.degree}
                    onChange={(v) => update(["education", i, "degree"], v)}
                    style={{ fontWeight: 700, fontSize: 15, color: HEADING }}
                  />
                  <Editable
                    as="div"
                    value={ed.school}
                    onChange={(v) => update(["education", i, "school"], v)}
                    style={{ fontSize: 14, color: BODY, marginTop: 4 }}
                  />
                  <Editable
                    as="div"
                    value={ed.date}
                    onChange={(v) => update(["education", i, "date"], v)}
                    style={{ fontWeight: 700, fontSize: 14, color: HEADING, marginTop: 6 }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* SKILLS + AWARDS row */}
        <div className="flex" style={{ gap: 40, marginTop: 24 }}>
          <div className="flex-1">
            <Section title="Skills" mt={0} />
            <div className="flex" style={{ gap: 20, marginTop: 14 }}>
              {skillCols.map((col, c) => (
                <ul
                  key={c}
                  className="flex-1"
                  style={{ margin: 0, paddingLeft: 22, fontSize: 13.5, lineHeight: 2, color: BODY, listStyle: "disc" }}
                >
                  {col.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <Section title="Awards" mt={0} />
            <ul style={{ margin: "14px 0 0", paddingLeft: 22, fontSize: 13.5, lineHeight: 2, color: BODY, listStyle: "disc" }}>
              {(data.languages || []).map((l, i) => (
                <li key={i}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .mnc-list { margin: 6px 0 0; padding-left: 6px; list-style: none; }
        .mnc-list > li { font-size: 13.5px; line-height: 1.6; color: ${BODY}; }
      `}</style>
    </div>
  );
}

function Section({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 20, fontWeight: 500, letterSpacing: 1, color: NAVY, marginTop: mt ?? 24 }}
      >
        {title}
      </Tag>
      <div style={{ height: 1, background: NAVY, marginTop: 8 }} />
    </>
  );
}

function chunkInto(arr, n) {
  const out = Array.from({ length: n }, () => []);
  const per = Math.ceil(arr.length / n);
  arr.forEach((item, i) => out[Math.min(Math.floor(i / per), n - 1)].push(item));
  return out;
}
