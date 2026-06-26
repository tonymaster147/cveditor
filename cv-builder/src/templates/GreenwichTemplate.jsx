import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Greenwich" — balanced, polished single-column CV in Poppins.
// Centered name + role, thin rule, contact line. Section headings sit on a
// soft grey-blue bar that spans the page. Skills render as a 3-column grid.
const BAR = "#dfe4e8";

export default function GreenwichTemplate({ data, update /*, accent*/ }) {
  const blocks = makeBlocks(data, update);

  // Chunk skills into 3 columns balanced for height.
  const skillCols = chunkInto(data.skills || [], 3);

  return (
    <div
      className="cv-page"
      style={{
        fontFamily: "'Poppins', sans-serif",
        color: "#2b2b2b",
        padding: "46px 52px 52px",
        boxSizing: "border-box",
      }}
    >
      <Editable
        as="h1"
        value={data.name}
        onChange={(v) => update(["name"], v)}
        className="m-0 text-center uppercase"
        style={{ fontSize: 42, fontWeight: 600, letterSpacing: 1, color: "#1a1a1a" }}
      />
      <Editable
        as="div"
        value={data.role}
        onChange={(v) => update(["role"], v)}
        className="text-center"
        style={{ fontSize: 17, fontWeight: 600, color: "#444", marginTop: 2 }}
      />
      <div style={{ height: 1, background: "#d8d8d8", margin: "20px 0" }} />
      <div className="text-center" style={{ fontSize: 14, color: "#444" }}>
        <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
        <span>&nbsp;|&nbsp;</span>
        <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
        <span>&nbsp;|&nbsp;</span>
        <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
      </div>

      <Bar title="Summary" />
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ fontSize: 13.5, lineHeight: 1.7, color: "#333", margin: "14px 4px 0", textAlign: "justify" }}
      />

      <Bar title="Work Experience" mt={24} />
      {blocks.experience((exp, i) => (
        <div style={{ marginTop: 16, padding: "0 4px" }}>
          <div className="flex justify-between" style={{ fontSize: 14 }}>
            <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
              <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
              {", "}
              <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
            </span>
            <Editable
              as="span"
              value={exp.date}
              onChange={(v) => update(["experience", i, "date"], v)}
              style={{ fontWeight: 600, color: "#1a1a1a" }}
            />
          </div>
          <EditableList
            items={exp.bullets}
            onChange={(v) => update(["experience", i, "bullets"], v)}
            className="greenwich-list"
            bullet="•"
          />
        </div>
      ))}

      <Bar title="Education" mt={24} />
      {blocks.education((ed, i) => (
        <div style={{ marginTop: 16, padding: "0 4px" }}>
          <div className="flex justify-between" style={{ fontSize: 14 }}>
            <Editable
              as="span"
              value={ed.degree}
              onChange={(v) => update(["education", i, "degree"], v)}
              style={{ fontWeight: 600, color: "#1a1a1a" }}
            />
            <Editable
              as="span"
              value={ed.date}
              onChange={(v) => update(["education", i, "date"], v)}
              style={{ fontWeight: 600, color: "#1a1a1a" }}
            />
          </div>
          <Editable
            as="div"
            value={ed.school}
            onChange={(v) => update(["education", i, "school"], v)}
            style={{ fontSize: 13.5, color: "#333", marginTop: 4 }}
          />
        </div>
      ))}

      <Bar title="Key Skills" mt={24} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          marginTop: 14,
          padding: "0 4px",
        }}
      >
        {skillCols.map((col, c) => (
          <ul key={c} style={{ margin: 0, paddingLeft: 22, fontSize: 13.5, lineHeight: 1.9, color: "#333", listStyle: "disc" }}>
            {col.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ))}
      </div>

      <style>{`
        .greenwich-list { margin: 6px 0 0; padding-left: 24px; list-style: none; }
        .greenwich-list > li { font-size: 13.5px; line-height: 1.6; color: #333; }
      `}</style>
    </div>
  );
}

function Bar({ title, mt = 30 }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{
        background: BAR,
        padding: "9px 18px",
        marginTop: mt,
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: 0.5,
        color: "#1a1a1a",
      }}
    >
      {title}
    </Tag>
  );
}

// Split an array into `n` near-equal columns, preserving order column-major.
function chunkInto(arr, n) {
  const out = Array.from({ length: n }, () => []);
  const per = Math.ceil(arr.length / n);
  arr.forEach((item, i) => out[Math.min(Math.floor(i / per), n - 1)].push(item));
  return out;
}
