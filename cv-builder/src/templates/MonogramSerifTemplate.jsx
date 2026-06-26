import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { makeBlocks } from "./blockHelpers";

// Refined serif CV. Left grey sidebar with monogram initials, contact +
// skills + education + language. Right white column with serif name,
// summary, experience and references at the bottom.
export default function MonogramSerifTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);

  // Initials for the monogram circle, derived live from the candidate's name.
  const initials = (data.name || "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "EM";

  return (
    <div className="cv-page font-serif text-[11px] leading-snug text-gray-800 flex flex-col">
      {/* TOP — name area */}
      <div className="flex">
        {/* Left top: empty grey block for symmetry with sidebar below */}
        <div className="w-[33%]" style={{ background: "#D9D6D2" }} />

        {/* Right top: name + subtitle on white */}
        <div className="flex-1 bg-white pt-10 pb-6 px-10">
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="text-[44px] font-bold tracking-tight text-gray-800 leading-none"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="mt-2 text-[15px] text-gray-700"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          />
        </div>
      </div>

      {/* Thin black divider running across the entire page below the header */}
      <div className="h-px bg-gray-700 mx-10" />

      {/* MAIN — left sidebar + right content */}
      <div className="flex flex-1">
        {/* LEFT: grey sidebar */}
        <aside className="w-[33%] px-8 pb-8 pt-6" style={{ background: "#D9D6D2" }}>
          {/* Monogram circle at the very top of the sidebar */}
          <div className="flex justify-center -mt-24 mb-8">
            <PhotoUpload
              value={data.photo}
              onChange={(v) => update(["photo"], v)}
              size={140}
              shape="circle"
              fallback="monogram"
              monogramText={initials}
              monogramBg="#FFFFFF"
              monogramFg="#3a3a3a"
            />
          </div>

          <SidebarSection title="Contact" accent={accent}>
            <div className="space-y-1.5 text-[10px] text-gray-800">
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
              className="space-y-1 text-[10px] text-gray-800"
              bullet="•"
            />
          </SidebarSection>

          <SidebarSection title="Education" accent={accent}>
            {blocks.education((ed, i) => (
              <div className="mb-3 text-[10px]">
                <Editable
                  as="h3"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  className="font-bold uppercase tracking-wider text-gray-900 leading-tight"
                />
                <Editable
                  as="div"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  className="text-gray-700 mt-0.5"
                />
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  className="text-gray-700 italic mt-0.5"
                />
              </div>
            ))}
          </SidebarSection>

          <SidebarSection title="Language" accent={accent}>
            {blocks.languages((l, i) => (
              <div className="mb-1 text-[10px] text-gray-800 flex gap-2">
                <span>•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </SidebarSection>
        </aside>

        {/* RIGHT: main content */}
        <div className="flex-1 bg-white px-10 py-7">
          <MainSection title="Summary" accent={accent}>
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              className="text-[11px] text-gray-800 leading-relaxed"
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
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  className="font-semibold text-gray-800 mt-0.5"
                />
                <Editable
                  as="div"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  className="text-[10px] text-gray-700 mt-0.5"
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="mt-2 space-y-0.5 text-[11px] text-gray-800"
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
                    className="font-semibold text-gray-800"
                  />
                  <div className="mt-1.5 text-gray-700">
                    <span className="font-bold text-gray-900">Phone: </span>
                    <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  </div>
                  <div className="text-gray-700">
                    <span className="font-bold text-gray-900">Email : </span>
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

function SidebarSection({ title, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mt-5 first:mt-0">
      <Tag
        className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-800 mb-2"
      >
        {title}
      </Tag>
      {children}
    </section>
  );
}

function MainSection({ title, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mb-5 first:mt-0">
      <Tag
        className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-800 mb-2"
      >
        {title}
      </Tag>
      {children}
    </section>
  );
}
