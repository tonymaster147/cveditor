import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Bristol" — orange-accent single column. Name split into an orange first
// name + black surname, boxed grey contact card at top-right with orange
// bottom border, orange section headings underlined in grey. Experience
// rows have a ▶ marker and the date in orange.

const ORANGE = "#ea4b25";
const CONTACT_BG = "#f1f3f5";
const RULE = "#c9c9c9";
const BODY = "#333";
const HEADING_DARK = "#1a1a1a";
const FONT = "'Poppins', sans-serif";

// Split "ELSIE MURRAY" into ["ELSIE", "MURRAY"]. A single-word name puts
// everything in the accent slot (surname empty).
function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function BristolTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);
  const skillCols = chunkInto(data.skills || [], 2);

  return (
    <div
      className="cv-page"
      style={{ fontFamily: FONT, color: "#2b2b2b", padding: "48px 52px 52px", boxSizing: "border-box" }}
    >
      {/* HEADER — name (left) + boxed contact (right) */}
      <div className="flex" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 30 }}>
        <div>
          {/* Two independently-editable spans backed by slices of `data.name`.
              Click "ELSIE" to edit the first name, click "MURRAY" to edit the
              surname; both writes reconstruct the full name string. */}
          <h1
            className="m-0 uppercase"
            style={{ fontSize: 44, lineHeight: 1, letterSpacing: 1 }}
          >
            <Editable
              as="span"
              value={first}
              onChange={(v) => update(["name"], `${v} ${rest}`.trim())}
              style={{ color: ORANGE, fontWeight: 400 }}
            />
            {" "}
            <Editable
              as="span"
              value={rest}
              onChange={(v) => update(["name"], `${first} ${v}`.trim())}
              style={{ color: HEADING_DARK, fontWeight: 700 }}
            />
          </h1>
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontSize: 22, fontWeight: 700, color: HEADING_DARK, marginTop: 16 }}
          />
        </div>

        <div
          className="flex-none box-border"
          style={{
            width: 340,
            background: CONTACT_BG,
            borderBottom: `4px solid ${ORANGE}`,
            padding: "18px 22px",
          }}
        >
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7, color: BODY }}>
            <li><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></li>
            <li><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></li>
            <li><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></li>
          </ul>
        </div>
      </div>

      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ fontSize: 14, lineHeight: 1.7, color: BODY, margin: "30px 0 0", textAlign: "justify" }}
      />

      <Section title="Work Experience" />
      {blocks.experience((exp, i) => (
        <div key={i} style={{ marginTop: 16 }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center" style={{ gap: 10, fontSize: 15, fontWeight: 700, color: HEADING_DARK }}>
              <span>▶</span>
              <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
              <span> | </span>
              <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
            </div>
            <Editable
              as="span"
              value={exp.date}
              onChange={(v) => update(["experience", i, "date"], v)}
              style={{ fontSize: 14, color: ORANGE }}
            />
          </div>
          <EditableList
            items={exp.bullets}
            onChange={(v) => update(["experience", i, "bullets"], v)}
            className="bristol-list"
            bullet="•"
          />
        </div>
      ))}

      <Section title="Skills" />
      <div className="flex" style={{ gap: 40, marginTop: 16 }}>
        {skillCols.map((col, c) => (
          <div key={c} className="flex-1">
            <ul style={{ margin: 0, paddingLeft: 22, fontSize: 14, lineHeight: 1.8, color: BODY, listStyle: "disc" }}>
              {col.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Section title="Education" />
      {blocks.education((ed, i) => (
        <div key={i}>
          <div className="flex justify-between items-center" style={{ marginTop: 16 }}>
            <Editable
              as="span"
              value={ed.degree}
              onChange={(v) => update(["education", i, "degree"], v)}
              style={{ fontSize: 15, fontWeight: 700, color: HEADING_DARK }}
            />
            <Editable
              as="span"
              value={ed.date}
              onChange={(v) => update(["education", i, "date"], v)}
              style={{ fontSize: 14, color: ORANGE }}
            />
          </div>
          <Editable
            as="div"
            value={ed.school}
            onChange={(v) => update(["education", i, "school"], v)}
            style={{ fontSize: 14, color: BODY, marginTop: 6 }}
          />
        </div>
      ))}

      <Section title="Other" />
      <div className="flex" style={{ gap: 40, marginTop: 16 }}>
        <ul className="flex-1" style={{ margin: 0, paddingLeft: 22, fontSize: 14, lineHeight: 1.8, color: BODY, listStyle: "disc" }}>
          <li>
            <b>Languages:</b>{" "}
            {(data.languages || []).map((l, i) => (
              <span key={i}>
                {i > 0 && ", "}
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </span>
            ))}
          </li>
        </ul>
      </div>

      <style>{`
        .bristol-list { margin: 8px 0 0; padding-left: 6px; list-style: none; }
        .bristol-list > li { font-size: 14px; line-height: 1.6; color: ${BODY}; }
      `}</style>
    </div>
  );
}

function Section({ title }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 19, fontWeight: 700, color: ORANGE, letterSpacing: 0.5, marginTop: 28 }}
      >
        {title}
      </Tag>
      <div style={{ height: 1, background: RULE, marginTop: 8 }} />
    </>
  );
}

function chunkInto(arr, n) {
  const out = Array.from({ length: n }, () => []);
  const per = Math.ceil(arr.length / n);
  arr.forEach((item, i) => out[Math.min(Math.floor(i / per), n - 1)].push(item));
  return out;
}
