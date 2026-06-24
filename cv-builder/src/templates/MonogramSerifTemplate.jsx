import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { makeBlocks } from "./blockHelpers";

// Refined serif CV with a monogram initials avatar (no photo by default).
// Includes a References section that other templates don't have.
export default function MonogramSerifTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);

  // Derive initials for the monogram fallback from the candidate's name.
  const initials = (data.name || "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "EM";

  return (
    <div className="cv-page font-serif text-[11px] leading-snug text-gray-800">
      {/* Hero: monogram + name + role */}
      <header className="px-12 pt-10 pb-6 flex items-center gap-7 border-b border-gray-300">
        <PhotoUpload
          value={data.photo}
          onChange={(v) => update(["photo"], v)}
          size={110}
          shape="circle"
          fallback="monogram"
          monogramText={initials}
          monogramBg="#E5E1DC"
          monogramFg="#2c2c2c"
        />
        <div>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="text-5xl font-bold tracking-tight text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="mt-2 text-[14px] text-gray-600"
          />
        </div>
      </header>

      <div className="px-12 py-7 grid grid-cols-[33%_1fr] gap-8">
        {/* Left rail */}
        <aside className="text-[10px]">
          <SidebarSection title="Contact" accent={accent}>
            <div className="space-y-1.5 text-gray-800">
              <div>📞 <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></div>
              <div>✉ <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></div>
              <div>📍 <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></div>
              <div>🔗 <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></div>
            </div>
          </SidebarSection>

          <SidebarSection title="Skills" accent={accent}>
            <EditableList
              items={data.skills}
              onChange={(v) => update(["skills"], v)}
              className="space-y-1 text-gray-800"
              bullet="•"
            />
          </SidebarSection>

          <SidebarSection title="Education" accent={accent}>
            {blocks.education((ed, i) => (
              <div className="mb-3">
                <Editable
                  as="h3"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  className="font-bold text-[11px] uppercase tracking-wider text-gray-900"
                />
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  className="text-gray-700"
                />
                <Editable
                  as="div"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  className="text-gray-500"
                />
              </div>
            ))}
          </SidebarSection>

          <SidebarSection title="Language" accent={accent}>
            {blocks.languages((l, i) => (
              <div className="mb-1 text-gray-800">
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                {l.level && (
                  <>
                    {" — "}
                    <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} className="text-gray-600" />
                  </>
                )}
              </div>
            ))}
          </SidebarSection>
        </aside>

        {/* Main */}
        <div>
          <MainSection title="Summary" accent={accent}>
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              className="text-[11px] text-gray-700 leading-relaxed"
            />
          </MainSection>

          <MainSection title="Experience" accent={accent}>
            {blocks.experience((exp, i) => (
              <div className="mb-4">
                <Editable
                  as="h3"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  className="text-[12px] font-bold uppercase tracking-wider text-gray-900"
                />
                <div className="flex justify-between items-baseline">
                  <Editable
                    as="span"
                    value={exp.company}
                    onChange={(v) => update(["experience", i, "company"], v)}
                    className="font-semibold"
                    style={{ color: accent }}
                  />
                  <Editable
                    as="span"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    className="text-[10px] text-gray-600"
                  />
                </div>
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="mt-1 space-y-0.5 text-[11px]"
                  bullet="•"
                />
              </div>
            ))}
          </MainSection>

          <MainSection title="References" accent={accent}>
            <div className="grid grid-cols-2 gap-5">
              {blocks.references((r, i) => (
                <div className="text-[10px]">
                  <Editable
                    as="h3"
                    value={r.name}
                    onChange={(v) => update(["references", i, "name"], v)}
                    className="text-[12px] font-bold uppercase tracking-wider text-gray-900"
                  />
                  <Editable
                    as="div"
                    value={r.role}
                    onChange={(v) => update(["references", i, "role"], v)}
                    className="font-semibold"
                    style={{ color: accent }}
                  />
                  <div className="mt-1 text-gray-700">
                    <span className="font-semibold text-gray-900">Phone: </span>
                    <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-900">Email: </span>
                    <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                  </div>
                </div>
              ))}
            </div>
          </MainSection>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mt-5 first:mt-0">
      <Tag
        className="text-[11px] font-bold uppercase tracking-[0.3em] mb-2 text-gray-700"
        style={{ color: accent }}
      >
        {title}
      </Tag>
      {children}
    </section>
  );
}

function MainSection({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mt-5 first:mt-0">
      <Tag
        className="text-[13px] font-bold uppercase tracking-[0.25em] mb-2"
        style={{ color: accent }}
      >
        {title}
      </Tag>
      {children}
    </section>
  );
}
