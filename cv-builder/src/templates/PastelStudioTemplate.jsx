import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { makeBlocks } from "./blockHelpers";

// Designer-leaning CV: pastel sidebar (photo + about + contact + skills +
// languages), bigger right column for experience + education. Inspired by
// soft pink/blush portfolio CVs.
export default function PastelStudioTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  // Soft pastel sidebar derived from accent so it doesn't fight the colour
  // picker (the visible accent stays distinct from the sidebar tint).
  const sidebar = "#F8E1DC"; // fixed pastel rose — matches the design language

  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800 flex">
      {/* Left: pastel column */}
      <aside className="w-[36%] p-7" style={{ background: sidebar }}>
        <div className="flex justify-center mb-5">
          <PhotoUpload value={data.photo} onChange={(v) => update(["photo"], v)} size={150} shape="circle" />
        </div>

        <SidebarSection title="About Me" accent={accent}>
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            className="text-[10px] text-gray-700 leading-relaxed"
          />
        </SidebarSection>

        <SidebarSection title="Contact" accent={accent}>
          <div className="space-y-1.5 text-[10px] text-gray-800">
            <div>📞 <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></div>
            <div>✉ <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></div>
            <div>🌐 <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></div>
            <div>📍 <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></div>
          </div>
        </SidebarSection>

        <SidebarSection title="Skills" accent={accent}>
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="space-y-1 text-[10px] text-gray-800"
            bullet="•"
          />
        </SidebarSection>

        <SidebarSection title="Languages" accent={accent}>
          {blocks.languages((l, i) => (
            <div className="mb-1 text-[10px] text-gray-800">
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} className="font-semibold" />
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

      {/* Right: main */}
      <div className="flex-1 p-9">
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="text-4xl font-extrabold uppercase tracking-wide text-gray-900"
        />
        <div className="mt-2 mb-1 h-px w-full" style={{ background: accent + "55" }} />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: accent }}
        />

        <MainSection title="Work Experience" accent={accent}>
          {blocks.experience((exp, i) => (
            <div className="mb-3">
              <Editable
                as="h3"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                className="text-[12px] font-bold uppercase tracking-wide text-gray-900"
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
                className="mt-1 space-y-0.5 text-[10px]"
                bullet="•"
              />
            </div>
          ))}
        </MainSection>

        <MainSection title="Education" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2">
              <Editable
                as="h3"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                className="text-[12px] font-bold uppercase tracking-wide text-gray-900"
              />
              <div className="flex justify-between items-baseline">
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  className="font-semibold"
                  style={{ color: accent }}
                />
                <Editable
                  as="div"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  className="text-[10px] text-gray-600"
                />
              </div>
            </div>
          ))}
        </MainSection>
      </div>
    </div>
  );
}

function MainSection({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mt-6">
      <Tag
        className="text-[11px] font-bold uppercase tracking-[0.25em] px-3 py-1 mb-3 inline-block w-full"
        style={{ background: accent + "22", color: accent }}
      >
        {title}
      </Tag>
      {children}
    </section>
  );
}

function SidebarSection({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mt-5 first:mt-0">
      <Tag
        className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b"
        style={{ color: accent, borderColor: accent + "55" }}
      >
        {title}
      </Tag>
      {children}
    </section>
  );
}
