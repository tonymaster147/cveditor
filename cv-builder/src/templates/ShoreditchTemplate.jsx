import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Shoreditch" — bold designer / graphic-designer CV in Poppins.
// Big centered name, italic-feel subtitle, copper rule. Then About Me, then
// a two-column split: left = contact/education/skills/languages, right =
// experience (with copper tick markers) + references.
export default function ShoreditchTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{
        fontFamily: "'Poppins', sans-serif",
        color: "#2b2b2b",
        padding: "54px 56px 48px",
        boxSizing: "border-box",
      }}
    >
      <Editable
        as="h1"
        value={data.name}
        onChange={(v) => update(["name"], v)}
        className="m-0 text-center uppercase"
        style={{ fontSize: 48, fontWeight: 800, letterSpacing: 1, color: "#1a1a1a", lineHeight: 1 }}
      />
      <Editable
        as="div"
        value={data.role}
        onChange={(v) => update(["role"], v)}
        className="text-center"
        style={{ fontSize: 26, fontWeight: 400, color: "#3a3a3a", marginTop: 6 }}
      />
      <div style={{ height: 1, background: accent, marginTop: 30 }} />

      <ColHeading title="About Me" mt={26} />
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ fontSize: 13.5, lineHeight: 1.7, color: "#333", margin: "12px 0 0", textAlign: "justify" }}
      />
      <div style={{ height: 1, background: accent, marginTop: 26 }} />

      <div className="flex" style={{ gap: 40, marginTop: 30 }}>
        {/* LEFT */}
        <div className="flex-none" style={{ width: 255 }}>
          <ColHeading title="Contact" />
          <div className="flex flex-col" style={{ marginTop: 18, gap: 16 }}>
            <Pill accent={accent} icon="✆">
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </Pill>
            <Pill accent={accent} icon="●">
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </Pill>
            <Pill accent={accent} icon="🌐">
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </Pill>
            <Pill accent={accent} icon="✉">
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </Pill>
          </div>

          <ColHeading title="Education" mt={34} />
          {blocks.education((ed, i) => (
            <div style={{ marginTop: 16 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a1a" }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 13, color: "#444", marginTop: 2 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13, color: "#666", marginTop: 6 }}
              />
            </div>
          ))}

          <ColHeading title="Skills" mt={34} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="shoreditch-list"
            bullet="•"
          />

          <ColHeading title="Languages" mt={34} />
          <div className="flex flex-wrap" style={{ gap: "8px 30px", marginTop: 16, fontSize: 13.5, color: "#333" }}>
            {blocks.languages((l, i) => (
              <Editable
                as="span"
                value={l.name}
                onChange={(v) => update(["languages", i, "name"], v)}
              />
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="flex-none" style={{ width: 1, background: "#cfcfcf" }} />

        {/* RIGHT */}
        <div className="flex-1">
          <ColHeading title="Work Experience" />
          {blocks.experience((exp, i) => (
            <div style={{ marginTop: 18, position: "relative", paddingLeft: 22 }}>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 6,
                  width: 14,
                  height: 4,
                  background: accent,
                }}
              />
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                className="uppercase"
                style={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a1a", letterSpacing: 0.5 }}
              />
              <div style={{ fontSize: 13.5, color: "#333", marginTop: 8 }}>
                <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                <span>{" - "}</span>
                <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
              </div>
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="shoreditch-list shoreditch-list-body"
                bullet="•"
              />
            </div>
          ))}

          <ColHeading title="Reference" mt={32} />
          <div className="flex" style={{ gap: 30, marginTop: 16 }}>
            {blocks.references((r, i) => (
              <div className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a1a" }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 13, color: "#444", marginTop: 2 }}
                />
                <div className="flex items-center" style={{ gap: 10, fontSize: 12.5, color: "#333", marginTop: 10 }}>
                  <SmallPill accent={accent} icon="✆" />
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div className="flex items-center" style={{ gap: 10, fontSize: 12.5, color: "#333", marginTop: 8 }}>
                  <SmallPill accent={accent} icon="✉" />
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .shoreditch-list { margin: 14px 0 0; padding-left: 20px; list-style: none; }
        .shoreditch-list > li { font-size: 13.5px; line-height: 2; color: #333; }
        .shoreditch-list-body { margin-top: 8px; }
        .shoreditch-list-body > li { line-height: 1.6; }
      `}</style>
    </div>
  );
}

function ColHeading({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontSize: 19, fontWeight: 700, color: "#1a1a1a", marginTop: mt || 0 }}
    >
      {title}
    </Tag>
  );
}

function Pill({ accent, icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 14, fontSize: 13.5, color: "#333" }}>
      <span
        className="flex items-center justify-center flex-none"
        style={{ width: 22, height: 22, borderRadius: "50%", background: accent, color: "#fff", fontSize: 12 }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function SmallPill({ accent, icon }) {
  return (
    <span
      className="flex items-center justify-center flex-none"
      style={{ width: 18, height: 18, borderRadius: "50%", background: accent, color: "#fff", fontSize: 10 }}
    >
      {icon}
    </span>
  );
}
