import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Template Rose" — designer / architect CV. Full-page soft pink background,
// centered name + subtitle at the top, then a pink-sidebar / white-main split
// for content. No photo in this revision.

const PAGE_BG = "#fdf4f3";
const SIDEBAR_BG = "#f6e4e2";
const BAR_BG = "#fbeae8";
const RULE = "#f0cfca";
const ICON = "#b98a6e";
const HEADING_DARK = "#2b2b2b";
const PLAQUE_DARK = "#2f2f2f";
const BODY = "#4a4a4a";
const MUTED = "#555555";

const MONTSERRAT = "'Montserrat', sans-serif";

export default function PastelStudioTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page flex flex-col"
      style={{ background: PAGE_BG, fontFamily: MONTSERRAT, color: "#3a3a3a" }}
    >
      {/* HEADER — full width, centered name + tracked-out subtitle + pink rule */}
      <header className="text-center" style={{ padding: "62px 40px 30px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 54, fontWeight: 800, letterSpacing: 1, color: HEADING_DARK, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ letterSpacing: 8, fontSize: 18, fontWeight: 600, color: "#3a3a3a", marginTop: 14 }}
        />
        <div style={{ width: 480, maxWidth: "100%", height: 2, background: RULE, margin: "16px auto 0" }} />
      </header>

      {/* BODY — sidebar + main */}
      <div className="flex flex-1">
        <aside
          className="flex-none box-border"
          style={{ width: 300, background: SIDEBAR_BG, padding: "34px 26px 50px" }}
        >
          <Plaque title="About Me" mt={0} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13, lineHeight: 1.55, color: BODY, margin: "16px 2px 0" }}
          />

          <Plaque title="Contact" mt={36} />
          <div className="flex flex-col" style={{ marginTop: 18, gap: 14 }}>
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

        <div className="flex-1 box-border" style={{ padding: "34px 40px 50px" }}>
          <BarHeading title="Work Experience" mt={0} />
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
    </div>
  );
}

// White-plaque sidebar heading: centered tracked caps in a white bar.
function Plaque({ title, mt }) {
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

// Full-width soft-pink section bar on the right column.
function BarHeading({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      style={{
        background: BAR_BG,
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
