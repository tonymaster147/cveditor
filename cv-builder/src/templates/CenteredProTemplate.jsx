import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// Centered single-column CV. Big serif teal name + contact strip in a grey
// hero band; sections below with thin underlines, pipe-separated job
// headers, bullet lists for skills and languages. NHS / clinical feel.
export default function CenteredProTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800">
      {/* HEADER — grey hero with centered name and contact row */}
      <header className="px-12 pt-8 pb-5 text-center" style={{ background: "#EFEFEF" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="text-[44px] font-bold tracking-tight"
          style={{ color: accent, fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.08em" }}
        />

        {/* Contact row in a horizontal line */}
        <div className="mt-5 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[11px] text-gray-700 border-b" style={{ borderColor: accent }}>
          <span className="pb-2 inline-flex items-center gap-1.5">
            <span style={{ color: accent }}>📞</span>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </span>
          <span className="pb-2 inline-flex items-center gap-1.5">
            <span style={{ color: accent }}>✉</span>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </span>
          <span className="pb-2 inline-flex items-center gap-1.5">
            <span style={{ color: accent }}>📍</span>
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </span>
        </div>
      </header>

      <div className="px-12 py-7">
        <Section title="Summary" accent={accent}>
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            className="text-[11px] text-gray-800 leading-relaxed"
          />
        </Section>

        <Section title="Key Skills" accent={accent}>
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="grid grid-cols-2 gap-x-8 gap-y-1 text-[11px] text-gray-800"
            bullet="•"
          />
        </Section>

        <Section title="Professional Experience" accent={accent}>
          {blocks.experience((exp, i) => (
            <div className="mb-3">
              {/* Pipe-separated header: Title | Company, Location | Date */}
              <div className="flex flex-wrap items-baseline gap-x-2 text-[12px]">
                <Editable
                  as="h3"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  className="font-bold text-gray-900"
                />
                <span className="text-gray-400">|</span>
                <Editable
                  as="span"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  className="font-bold text-gray-900"
                />
                {exp.location && (
                  <>
                    <span>,</span>
                    <Editable
                      as="span"
                      value={exp.location}
                      onChange={(v) => update(["experience", i, "location"], v)}
                      className="font-bold text-gray-900"
                    />
                  </>
                )}
                <span className="text-gray-400">|</span>
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  className="text-gray-700"
                />
              </div>
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="mt-1.5 space-y-0.5 text-[11px] text-gray-800"
                bullet="•"
              />
            </div>
          ))}
        </Section>

        <Section title="Education & Qualifications" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-1.5 text-[11px] flex gap-2">
              <span style={{ color: accent }}>•</span>
              <div>
                <Editable
                  as="span"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  className="font-bold text-gray-900"
                />
                <span>: </span>
                <Editable
                  as="span"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  className="text-gray-800"
                />
                {ed.date && (
                  <>
                    <span> </span>
                    <span className="text-gray-700">(<Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />)</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </Section>

        <Section title="Languages" accent={accent}>
          <ul className="space-y-1 text-[11px] text-gray-800">
            {blocks.languages((l, i) => (
              <li className="flex gap-2">
                <span style={{ color: accent }}>•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                {l.level && (
                  <span className="text-gray-700">
                    {" ("}
                    <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
                    {")"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mb-5">
      <Tag
        className="text-[14px] font-bold uppercase tracking-[0.15em] mb-3"
        style={{ color: accent, fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {title}
      </Tag>
      {children}
      <div className="mt-4 h-px" style={{ background: accent + "55" }} />
    </section>
  );
}
