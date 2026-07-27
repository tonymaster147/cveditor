import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Unified" design system, ported from the shared Claude Design source.
// Three named registry entries (Islington / Dulwich / Richmond) all share
// this component and pass in a `palette` — the visual system stays
// consistent while ink/band/rule change per theme. Accent still comes
// from the color picker so users can further tweak.
//
// Layout: band header (name + role + underline bar + contact row), then
// section stack: Summary / Skills 2-col / Education / Experience.
// Each section heading uses a ↘ marker + tracked-out caps + thin rule.

export default function UnifiedResumeBase({ data, update, accent, palette }) {
  const blocks = makeBlocks(data, update);
  const skillCols = chunkInto(data.skills || [], 2);
  const eduCols = chunkInto(data.education || [], 2);
  const P = palette;

  // Wrap so all body text picks up the palette color, and swap the class-
  // level accent (from the picker) into the section-marker slot.
  const A = accent || P.accent;

  return (
    <div
      className="cv-page flex flex-col"
      style={{ fontFamily: "'Barlow', Helvetica, Arial, sans-serif", color: P.body }}
    >
      {/* HEADER BAND */}
      <header
        className="flex flex-col items-center box-border"
        style={{
          background: P.band,
          borderBottom: `1px solid ${P.rule}`,
          padding: "28px 40px 22px",
          gap: 4,
        }}
      >
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase text-center"
          style={{ fontSize: 34, fontWeight: 700, letterSpacing: "0.02em", color: P.ink, lineHeight: 1.05 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="text-center"
          style={{ fontSize: 18, fontWeight: 400, color: P.ink }}
        />
        <div style={{ width: 160, height: 3, background: P.ink, margin: "10px 0 12px" }} />
        <div
          className="flex flex-wrap justify-center"
          style={{ gap: 26, fontSize: 13, color: P.body }}
        >
          <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
        </div>
      </header>

      {/* BODY */}
      <div
        className="flex flex-col box-border"
        style={{ padding: "24px 40px 32px", gap: 22 }}
      >
        <Section title="Professional Summary" accent={A} ink={P.ink} rule={P.rule}>
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: P.body }}
          />
        </Section>

        <Section title="Key Competencies" accent={A} ink={P.ink} rule={P.rule}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 32px",
              fontSize: 13.5,
              lineHeight: 1.5,
              color: P.body,
            }}
          >
            {skillCols.map((col, c) => (
              <ul key={c} style={{ margin: 0, paddingLeft: 20, listStyle: "disc" }}>
                {col.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ))}
          </div>
        </Section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 32px" }}>
          <Section title="Education" accent={A} ink={P.ink} rule={P.rule}>
            <div className="flex flex-col" style={{ gap: 12, fontSize: 13.5, lineHeight: 1.45, color: P.body }}>
              {(eduCols[0] || []).map((ed, offset) => (
                <EducationItem key={offset} ed={ed} i={offset} ink={P.ink} update={update} />
              ))}
            </div>
          </Section>
          <Section title="Certification" accent={A} ink={P.ink} rule={P.rule}>
            <div className="flex flex-col" style={{ gap: 12, fontSize: 13.5, lineHeight: 1.45, color: P.body }}>
              {(eduCols[1] || []).map((ed, offset) => (
                <EducationItem key={offset} ed={ed} i={offset + eduCols[0].length} ink={P.ink} update={update} />
              ))}
              {/* Also render the languages field here as certification bullets so
                  users get an editable list without a new data model. */}
              {blocks.languages((l, i) => (
                <div key={`lang-${i}`}>
                  <Editable
                    as="span"
                    value={l.name}
                    onChange={(v) => update(["languages", i, "name"], v)}
                    style={{ fontWeight: 600, color: P.ink }}
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>

        <Section title="Professional Experience" accent={A} ink={P.ink} rule={P.rule}>
          <div className="flex flex-col" style={{ gap: 16, fontSize: 13.5, lineHeight: 1.5, color: P.body }}>
            {blocks.experience((exp, i) => (
              <div key={i} className="flex flex-col" style={{ gap: 4 }}>
                <div className="flex justify-between items-baseline" style={{ gap: 18 }}>
                  <Editable
                    as="span"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontWeight: 600, color: P.ink }}
                  />
                  <Editable
                    as="span"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    style={{ fontStyle: "italic", fontWeight: 600, textDecoration: "underline", color: P.ink }}
                  />
                </div>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="unified-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>
        </Section>
      </div>

      <style>{`
        .unified-list { margin: 4px 0 0; padding-left: 20px; list-style: disc; }
        .unified-list > li { font-size: 13px; line-height: 1.45; color: ${P.body}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function Section({ title, accent, ink, rule, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="flex flex-col" style={{ gap: 10 }}>
      <div
        className="flex items-center"
        style={{ gap: 10, borderBottom: `1.5px solid ${rule}`, paddingBottom: 5 }}
      >
        <span style={{ color: accent, fontSize: 15, fontWeight: 600 }}>↘</span>
        <Tag
          className="uppercase m-0"
          style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.09em", color: ink }}
        >
          {title}
        </Tag>
      </div>
      {children}
    </section>
  );
}

function EducationItem({ ed, i, ink, update }) {
  return (
    <div>
      <Editable
        as="div"
        value={ed.date}
        onChange={(v) => update(["education", i, "date"], v)}
        style={{ textDecoration: "underline", color: ink }}
      />
      <Editable
        as="div"
        value={ed.degree}
        onChange={(v) => update(["education", i, "degree"], v)}
        style={{ fontWeight: 600, color: ink }}
      />
      <Editable
        as="div"
        value={ed.school}
        onChange={(v) => update(["education", i, "school"], v)}
      />
    </div>
  );
}

function chunkInto(arr, n) {
  const out = Array.from({ length: n }, () => []);
  const per = Math.max(1, Math.ceil(arr.length / n));
  arr.forEach((item, i) => out[Math.min(Math.floor(i / per), n - 1)].push(item));
  return out;
}
