import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// Clean centered-name single-column CV. Big serif name at the top, contact
// strip beneath, then full-width sections. Strong NHS / professional feel.
// No photo. Looks great in teal/blue but works in any accent colour.
export default function CenteredProTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800">
      {/* Centered hero */}
      <header className="px-12 pt-9 pb-5 text-center" style={{ background: accent + "11" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="text-[42px] font-bold tracking-tight"
          style={{ color: accent, fontFamily: "Georgia, serif" }}
        />
        <div className="mt-3 h-px w-full" style={{ background: accent + "44" }} />
        <div className="mt-3 flex flex-wrap justify-center items-center gap-x-5 gap-y-1 text-[11px] text-gray-700">
          <ContactPill icon="📞">
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </ContactPill>
          <ContactPill icon="✉">
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </ContactPill>
          <ContactPill icon="📍">
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </ContactPill>
        </div>
      </header>

      <div className="px-12 py-7">
        <Section title="Summary" accent={accent}>
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            className="text-[11px] text-gray-700 leading-relaxed"
          />
        </Section>

        <Section title="Key Skills" accent={accent}>
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="space-y-1 text-[11px] text-gray-800 grid grid-cols-2 gap-x-6"
            bullet="•"
          />
        </Section>

        <Section title="Professional Experience" accent={accent}>
          {blocks.experience((exp, i) => (
            <div className="mb-3">
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
                  className="font-bold"
                  style={{ color: accent }}
                />
                <span className="text-gray-400">|</span>
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  className="text-gray-600 text-[11px]"
                />
                {exp.location && (
                  <>
                    <span className="text-gray-400">|</span>
                    <Editable
                      as="span"
                      value={exp.location}
                      onChange={(v) => update(["experience", i, "location"], v)}
                      className="text-gray-600 text-[11px] italic"
                    />
                  </>
                )}
              </div>
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="mt-1 space-y-0.5 text-[11px]"
                bullet="•"
              />
            </div>
          ))}
        </Section>

        <Section title="Education & Qualifications" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2 text-[11px]">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <Editable
                  as="h3"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  className="font-bold text-gray-900"
                />
                <span className="text-gray-400">|</span>
                <Editable
                  as="span"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  className="font-semibold"
                  style={{ color: accent }}
                />
                <span className="text-gray-400">|</span>
                <Editable
                  as="span"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  className="text-gray-600"
                />
              </div>
            </div>
          ))}
        </Section>

        <Section title="Languages" accent={accent}>
          <ul className="space-y-1 text-[11px] text-gray-800">
            {blocks.languages((l, i) => (
              <li className="flex gap-2">
                <span style={{ color: accent }}>•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} className="font-semibold" />
                {l.level && (
                  <>
                    <span className="text-gray-400">—</span>
                    <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} className="text-gray-600" />
                  </>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function ContactPill({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{icon}</span>
      {children}
    </span>
  );
}

function Section({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mb-5">
      <Tag
        className="text-[14px] font-bold uppercase tracking-[0.15em] pb-1 mb-2 border-b-2"
        style={{ color: accent, borderColor: accent }}
        translate="no"
      >
        {title}
      </Tag>
      {children}
    </section>
  );
}
