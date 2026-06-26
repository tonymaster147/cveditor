import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { makeBlocks } from "./blockHelpers";

// "Template Rose" — designer / architect CV with a soft pink sidebar.
// Mirrors the Claude Design source exactly (300px sidebar, framed photo,
// white-plaque section headings, pink full-width bars on the right column).
//
// Colors are kept hardcoded (#f4dcd9 sidebar, #f0cfca rule, #b98a6e icons)
// because the design's identity is the rose palette. The `accent` prop is
// reserved for future use; changing the colour picker doesn't repaint the
// sidebar in this template by design.

const ROSE_BG = "#f4dcd9";
const ROSE_RULE = "#f0cfca";
const ICON = "#b98a6e";
const HEADING_DARK = "#2b2b2b";
const PLAQUE_DARK = "#2f2f2f";
const BODY = "#4a4a4a";
const MUTED = "#555555";

const MONTSERRAT = "'Montserrat', sans-serif";

export default function PastelStudioTemplate({ data, update /*, accent*/ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page flex"
      style={{ fontFamily: MONTSERRAT, color: "#3a3a3a" }}
    >
      {/* LEFT SIDEBAR — 300px fixed */}
      <aside
        className="flex-none"
        style={{ width: 300, background: ROSE_BG, padding: "0 26px 40px" }}
      >
        {/* Framed photo */}
        <div
          className="flex items-center justify-center"
          style={{
            margin: "34px 6px 0",
            border: "3px solid #ffffff",
            padding: "22px 0",
          }}
        >
          <PhotoUpload
            value={data.photo}
            onChange={(v) => update(["photo"], v)}
            size={158}
            shape="circle"
          />
        </div>

        <Plaque title="About Me" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{
            fontSize: 13,
            lineHeight: 1.55,
            color: BODY,
            margin: "16px 2px 0",
          }}
        />

        <Plaque title="Contact" mt={36} />
        <div
          className="flex flex-col"
          style={{ marginTop: 18, gap: 14 }}
        >
          <ContactRow icon="✆">
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </ContactRow>
          <ContactRow icon="✉">
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </ContactRow>
          <ContactRow icon="🌐">
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </ContactRow>
          <ContactRow icon="●" align="start">
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </ContactRow>
        </div>

        <Plaque title="Skills" mt={36} />
        <EditableList
          items={data.skills}
          onChange={(v) => update(["skills"], v)}
          className="pastel-list"
          itemClassName="pastel-list-item"
          bullet="•"
        />

        <Plaque title="Languages" mt={32} />
        <ul className="pastel-list">
          {blocks.languages((l, i) => (
            <li key={i} className="pastel-list-item flex gap-2 items-start">
              <span className="shrink-0">•</span>
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
            </li>
          ))}
        </ul>

        <style>{`
          .pastel-list { margin: 16px 0 0; padding-left: 6px; list-style: none; }
          .pastel-list-item { font-size: 13px; line-height: 1.95; color: ${BODY}; }
        `}</style>
      </aside>

      {/* RIGHT MAIN */}
      <div className="flex-1 box-border" style={{ padding: "64px 44px 40px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 text-right"
          style={{
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: 1,
            color: HEADING_DARK,
            lineHeight: 1,
          }}
        />
        <div style={{ height: 3, background: ROSE_RULE, margin: "18px 0 16px" }} />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="text-center uppercase"
          style={{
            letterSpacing: 7,
            fontSize: 17,
            fontWeight: 600,
            color: "#3a3a3a",
          }}
        />

        <BarHeading title="Work Experience" mt={46} />
        {blocks.experience((exp, i) => (
          <div style={{ marginTop: 24 }}>
            <Editable
              as="h3"
              value={exp.title}
              onChange={(v) => update(["experience", i, "title"], v)}
              className="uppercase"
              style={{ fontWeight: 700, fontSize: 16, color: HEADING_DARK }}
            />
            <Editable
              as="div"
              value={exp.company}
              onChange={(v) => update(["experience", i, "company"], v)}
              style={{ fontWeight: 700, fontSize: 14, marginTop: 7, color: HEADING_DARK }}
            />
            <Editable
              as="div"
              value={exp.date}
              onChange={(v) => update(["experience", i, "date"], v)}
              style={{ fontSize: 13, color: MUTED, marginTop: 7 }}
            />
            {/* Bullets render as a single paragraph (matching design) — join with line breaks */}
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="mt-2"
              bullet="•"
            />
          </div>
        ))}

        <BarHeading title="Education" mt={36} />
        {blocks.education((ed, i) => (
          <div style={{ marginTop: 22 }}>
            <Editable
              as="h3"
              value={ed.degree}
              onChange={(v) => update(["education", i, "degree"], v)}
              className="uppercase"
              style={{ fontWeight: 700, fontSize: 15, color: HEADING_DARK }}
            />
            <Editable
              as="div"
              value={ed.school}
              onChange={(v) => update(["education", i, "school"], v)}
              style={{ fontSize: 13, color: BODY, marginTop: 6 }}
            />
            <Editable
              as="div"
              value={ed.date}
              onChange={(v) => update(["education", i, "date"], v)}
              style={{ fontSize: 13, color: MUTED, marginTop: 6 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// "White plaque" sidebar heading: centered, tracked-out caps in a white bar.
function Plaque({ title, mt = 40 }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      style={{
        background: "#ffffff",
        textAlign: "center",
        padding: "7px 0",
        marginTop: mt,
        fontWeight: 700,
        letterSpacing: 3,
        fontSize: 17,
        color: PLAQUE_DARK,
      }}
    >
      {title}
    </Tag>
  );
}

// Full-width pink section bar on the right column ("WORK EXPERIENCE" etc.)
function BarHeading({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      style={{
        background: ROSE_BG,
        padding: "9px 16px",
        marginTop: mt,
        fontWeight: 800,
        letterSpacing: 1,
        fontSize: 20,
        color: HEADING_DARK,
      }}
    >
      {title}
    </Tag>
  );
}

function ContactRow({ icon, align = "center", children }) {
  return (
    <div
      className={align === "start" ? "flex items-start" : "flex items-center"}
      style={{ gap: 14, fontSize: 13, color: BODY }}
    >
      <span style={{ color: ICON, fontSize: 16, lineHeight: align === "start" ? 1.4 : undefined }}>
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
