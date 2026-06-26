import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Cambridge" — refined single-column clinical/professional CV.
// Centered name, blue role under, contact line, thick accent rule.
// Section headings: blue caps + thin grey divider line.
// Job/school rows: two-column flex (title left, date right).
export default function CambridgeTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{
        fontFamily: "'Arimo', Arial, sans-serif",
        color: "#222",
        padding: "48px 56px 56px",
        boxSizing: "border-box",
      }}
    >
      <Editable
        as="h1"
        value={data.name}
        onChange={(v) => update(["name"], v)}
        className="m-0 text-center uppercase"
        style={{ fontSize: 46, fontWeight: 700, letterSpacing: 1, color: "#1a1a1a" }}
      />
      <Editable
        as="div"
        value={data.role}
        onChange={(v) => update(["role"], v)}
        className="text-center uppercase"
        style={{ fontSize: 19, fontWeight: 700, color: accent, marginTop: 4 }}
      />
      <div className="text-center" style={{ fontSize: 15, color: "#333", marginTop: 16 }}>
        <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
        <span>&nbsp;|&nbsp;</span>
        <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
        <span>&nbsp;|&nbsp;</span>
        <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
      </div>
      <div style={{ height: 4, background: accent, marginTop: 14 }} />

      <Section title="Summary" accent={accent}>
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontSize: 14.5, lineHeight: 1.6, color: "#222", margin: "12px 0 0", textAlign: "justify" }}
        />
      </Section>

      <Section title="Professional Experience" accent={accent}>
        {blocks.experience((exp, i) => (
          <div style={{ marginTop: 14 }}>
            <div className="flex justify-between" style={{ fontSize: 14.5 }}>
              <span style={{ fontWeight: 700, color: "#1a1a1a" }}>
                <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                {", "}
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              </span>
              <Editable
                as="span"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontWeight: 700, color: "#1a1a1a" }}
              />
            </div>
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="cambridge-list"
              bullet="•"
            />
          </div>
        ))}
      </Section>

      <Section title="Skills" accent={accent}>
        <EditableList
          items={data.skills}
          onChange={(v) => update(["skills"], v)}
          className="cambridge-list"
          bullet="•"
        />
      </Section>

      <Section title="Education" accent={accent}>
        {blocks.education((ed, i) => (
          <div style={{ marginTop: 12 }}>
            <div className="flex justify-between" style={{ fontSize: 14.5 }}>
              <Editable
                as="span"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, color: "#1a1a1a" }}
              />
              <Editable
                as="span"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontWeight: 700, color: "#1a1a1a" }}
              />
            </div>
            <Editable
              as="div"
              value={ed.school}
              onChange={(v) => update(["education", i, "school"], v)}
              style={{ fontSize: 14.5, color: "#222", marginTop: 4 }}
            />
          </div>
        ))}
      </Section>

      <style>{`
        .cambridge-list { margin: 8px 0 0; padding-left: 22px; list-style: none; }
        .cambridge-list > li { font-size: 14.5px; line-height: 1.55; color: #222; }
      `}</style>
    </div>
  );
}

function Section({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section>
      <Tag
        className="uppercase"
        style={{ fontSize: 17, fontWeight: 700, color: accent, marginTop: 24 }}
      >
        {title}
      </Tag>
      <div style={{ height: 1, background: "#bbb", marginTop: 6 }} />
      {children}
    </section>
  );
}
