import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Marylebone" — centered name with a pale-blue highlight span behind the
// surname, tracked-out sub-role, icon contact row, two-column body with a
// left column (Summary / Education / Skills / Language) and right column
// (Experience / References). A dark grey footer bar caps the page.

const NAVY = "#1c2b3a";
const HIGHLIGHT = "#bfe0f6";
const FOOTER = "#3a3a3a";
const HEADING = "#1a1a1a";
const BODY = "#333";
const FONT = "'Poppins', sans-serif";

function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function MaryleboneTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: BODY }}>
      <div className="flex-1 box-border" style={{ padding: "56px 54px 40px" }}>
        {/* HEADER */}
        <div className="text-center">
          <h1
            className="m-0 uppercase"
            style={{ fontWeight: 300, fontSize: 46, letterSpacing: 10, lineHeight: 1.1, color: NAVY }}
          >
            <Editable
              as="span"
              value={first}
              onChange={(v) => update(["name"], `${v} ${rest}`.trim())}
            />
            {" "}
            <Editable
              as="span"
              value={rest}
              onChange={(v) => update(["name"], `${first} ${v}`.trim())}
              style={{ background: HIGHLIGHT, padding: "2px 10px" }}
            />
          </h1>
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontWeight: 300, fontSize: 21, letterSpacing: 9, color: "#5a5a5a", marginTop: 14 }}
          />
        </div>

        {/* CONTACT ROW with SVG icons */}
        <div
          className="flex flex-wrap"
          style={{ justifyContent: "space-between", marginTop: 34, gap: 16, fontSize: 15, letterSpacing: 2, color: BODY }}
        >
          <div className="flex items-center" style={{ gap: 10 }}>
            <PhoneIcon />
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </div>
          <div className="flex items-center" style={{ gap: 10 }}>
            <PinIcon />
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </div>
          <div className="flex items-center" style={{ gap: 10 }}>
            <MailIcon />
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </div>
        </div>

        {/* TWO COLUMNS */}
        <div className="flex" style={{ gap: 40, marginTop: 44 }}>
          {/* LEFT */}
          <div className="flex-none" style={{ width: 270 }}>
            <RuleTitle text="Summary" />
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ margin: "16px 0 0", fontSize: 13, lineHeight: 1.65, color: "#3a3a3a", textAlign: "justify" }}
            />

            <RuleTitle text="Education" mt={34} />
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginTop: 18 }}>
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontSize: 14.5, fontWeight: 700, color: HEADING }}
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
                  style={{ fontSize: 14, color: BODY }}
                />
              </div>
            ))}

            <RuleTitle text="Skills" mt={34} />
            <EditableList
              items={data.skills}
              onChange={(v) => update(["skills"], v)}
              className="mlb-list"
              bullet="•"
            />

            <RuleTitle text="Language" mt={34} />
            <ul className="mlb-list">
              {blocks.languages((l, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="shrink-0">•</span>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="flex-1">
            <RuleTitle text="Experience" />
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 18 : 24 }}>
                <div className="flex justify-between items-baseline">
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontSize: 17, fontWeight: 500, color: HEADING }}
                  />
                  <Editable
                    as="div"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: NAVY }}
                  />
                </div>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontSize: 14, color: BODY, marginTop: 4 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="mlb-exp-list"
                  bullet="•"
                />
              </div>
            ))}

            <RuleTitle text="References" mt={34} />
            <div className="flex" style={{ gap: 30, marginTop: 18 }}>
              {blocks.references((r, i) => (
                <div key={i} className="flex-1">
                  <Editable
                    as="div"
                    value={r.name}
                    onChange={(v) => update(["references", i, "name"], v)}
                    style={{ fontSize: 16, fontWeight: 700, color: HEADING }}
                  />
                  <Editable
                    as="div"
                    value={r.role}
                    onChange={(v) => update(["references", i, "role"], v)}
                    style={{ fontSize: 13.5, color: "#4a4a4a", marginTop: 2 }}
                  />
                  <div style={{ fontSize: 13.5, color: BODY, marginTop: 12 }}>
                    <b>Phone:</b>&nbsp;{" "}
                    <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  </div>
                  <div style={{ fontSize: 13.5, color: BODY, marginTop: 5 }}>
                    <b>Email :</b>&nbsp;{" "}
                    <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .mlb-list { margin: 16px 0 0; padding-left: 20px; list-style: none; }
          .mlb-list > li { font-size: 15px; line-height: 2.1; color: #2b2b2b; }
          .mlb-exp-list { margin: 10px 0 0; padding-left: 20px; list-style: disc; }
          .mlb-exp-list > li { font-size: 13.5px; line-height: 1.55; color: #3a3a3a; }
        `}</style>
      </div>

      {/* FOOTER BAR */}
      <div className="flex-none" style={{ height: 56, background: FOOTER }} />
    </div>
  );
}

function RuleTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 16, marginTop: mt || 0 }}>
      <Tag
        className="uppercase m-0"
        style={{ fontSize: 17, fontWeight: 600, letterSpacing: 1, color: NAVY }}
      >
        {text}
      </Tag>
      <div className="flex-1" style={{ height: 1, background: "#2b2b2b" }} />
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" strokeWidth="1.6">
      <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" strokeWidth="1.6">
      <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2b2b2b" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
