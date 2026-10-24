import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Redbridge" — Montserrat throughout. Peach-over-grey split backdrop
// framing an inset white card. Left column: centered bold two-line name,
// spaced role, then Contact (summary + icon rows) / Skills / Language
// with hollow-ring bullets. Right column: dot-and-rail timelines for
// Experience & Education, then a two-up References block.

const INK = "#4a4a4a";
const TITLE = "#3f3f3f";
const SOFT = "#5a5a5a";
const RULE = "#bdbdbd";
const FONT = "'Montserrat', sans-serif";

export default function RedbridgeTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{
        padding: 31,
        overflow: "hidden",
        fontFamily: FONT,
        color: INK,
        background: "linear-gradient(to bottom,#fad8c5 0,#fad8c5 47%,#d4d7da 47%,#d4d7da 100%)",
      }}
    >
      <div
        style={{
          minHeight: 1061,
          background: "#fff",
          border: "1px solid #cfcfcf",
          padding: "36px 38px",
          display: "flex",
          gap: 34,
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ width: 236, flex: "0 0 236px" }}>
          <div style={{ textAlign: "center", marginTop: 70 }}>
            <Editable
              as="h1"
              value={data.name}
              onChange={(v) => update(["name"], v)}
              className="m-0 uppercase"
              style={{ fontWeight: 800, color: INK, fontSize: 40, lineHeight: 1.02, letterSpacing: 0.5 }}
            />
            <Editable
              as="div"
              value={data.role}
              onChange={(v) => update(["role"], v)}
              style={{ color: "#8f8f8f", fontSize: 14, letterSpacing: 2.5, lineHeight: 1.45, marginTop: 10 }}
            />
          </div>

          <Head text="Contact" mt={56} rule={RULE} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 11, color: "#555", lineHeight: 1.7, textAlign: "justify", margin: "0 0 16px" }}
          />
          <IconRow icon={<PhoneIcon />}>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </IconRow>
          <IconRow icon={<AtIcon />}>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </IconRow>
          <IconRow icon={<PinIcon />}>
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </IconRow>

          <Head text="Skills" mt={32} rule={RULE} />
          <ul className="red-ring">
            {(data.skills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <Head text="Language" mt={28} rule={RULE} />
          <ul className="red-ring">
            {blocks.languages((l, i) => (
              <li key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Head text="Experience" mt={0} rule="#9a9a9a" />
          {blocks.experience((exp, i) => (
            <TimelineItem key={i}>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                style={{ fontSize: 15, color: TITLE }}
              />
              <SubRow
                left={
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                }
                right={<Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="red-list"
                bullet="•"
              />
            </TimelineItem>
          ))}

          <Head text="Education" mt={24} rule="#9a9a9a" />
          {blocks.education((ed, i) => (
            <TimelineItem key={i}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 15, color: TITLE }}
              />
              <SubRow
                left={<Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />}
                right={<Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />}
              />
              <Editable
                as="div"
                value={ed.location}
                onChange={(v) => update(["education", i, "location"], v)}
                style={{ fontSize: 11, color: SOFT, marginTop: 4 }}
              />
            </TimelineItem>
          ))}

          <Head text="References" mt={24} rule="#9a9a9a" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 24, rowGap: 16 }}>
            {blocks.references((r, i) => (
              <div key={i}>
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontWeight: 700, color: "#3a3a3a", fontSize: 16 }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 12.5, color: "#555", marginTop: 1 }}
                />
                <div style={{ fontSize: 11, color: "#555", marginTop: 10 }}>
                  <strong style={{ fontWeight: 700 }}>Phone:</strong>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 5, wordBreak: "break-word" }}>
                  <strong style={{ fontWeight: 700 }}>Email :</strong>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .red-ring { margin: 0; padding: 0; list-style: none; }
        .red-ring li { position: relative; padding-left: 20px; margin-bottom: 12px; font-size: 14px; color: ${INK}; }
        .red-ring li:before { content: ""; position: absolute; left: 3px; top: 5px; width: 7px; height: 7px; border-radius: 50%; border: 1.5px solid ${INK}; box-sizing: border-box; }
        .red-list { margin: 5px 0 0; padding: 0; list-style: none; }
        .red-list > li { font-size: 11px; line-height: 1.6; color: ${SOFT}; margin-bottom: 1px; }
      `}</style>
    </div>
  );
}

function Head({ text, mt, rule }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag className="m-0" style={{ fontWeight: 700, color: INK, fontSize: 23, marginTop: mt }}>
        {text}
      </Tag>
      <div style={{ height: 1, background: rule, margin: "9px 0 18px" }} />
    </>
  );
}

function TimelineItem({ children }) {
  return (
    <div className="red-tl" style={{ display: "flex", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 10px", paddingTop: 5 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#555", flex: "0 0 auto" }} />
        <span style={{ width: 1.5, flex: 1, background: "#bbb" }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 16 }}>{children}</div>
    </div>
  );
}

function SubRow({ left, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
      <em style={{ fontStyle: "italic", fontSize: 12, color: SOFT }}>{left}</em>
      <span style={{ fontSize: 11, color: "#6a6a6a", whiteSpace: "nowrap" }}>{right}</span>
    </div>
  );
}

function IconRow({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
      {icon}
      <span style={{ fontSize: 11.5, color: INK, wordBreak: "break-word" }}>{children}</span>
    </div>
  );
}

const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: INK,
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: { flex: "0 0 auto" },
};

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14.5 3.5 20 9l-9.5 9.5a4 4 0 0 1-6-6L14.5 3.5z" transform="rotate(10 12 12)" />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
