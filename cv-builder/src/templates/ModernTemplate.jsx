import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function ModernTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800 flex">
      <div className="flex-1 p-10">
        <Editable as="h1" value={data.name} onChange={(v) => update(["name"], v)} className="text-3xl font-bold uppercase tracking-wide text-gray-900" />
        <Editable as="div" value={data.role} onChange={(v) => update(["role"], v)} className="mt-1 font-semibold" style={{ color: accent }} />

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-gray-600 text-[10px]">
          <span>📞 <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} /></span>
          <span>✉ <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} /></span>
          <span>🔗 <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} /></span>
          <span>📍 <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} /></span>
        </div>

        <Section title="Summary" accent={accent}>
          <Editable as="p" value={data.summary} onChange={(v) => update(["summary"], v)} multiline className="text-gray-700" />
        </Section>

        <Section title="Experience" accent={accent}>
          {blocks.experience((exp, i) => (
            <div className="mb-3">
              <div className="flex justify-between items-baseline">
                <Editable as="h3" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-bold text-gray-900" />
                <Editable as="span" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} className="text-[10px] text-gray-600" />
              </div>
              <div className="flex justify-between items-baseline">
                <Editable as="span" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} className="font-semibold" style={{ color: accent }} />
                <Editable as="span" value={exp.location} onChange={(v)=>update(["experience",i,"location"],v)} className="text-[10px] text-gray-600" />
              </div>
              <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5" bullet="•" />
            </div>
          ))}
        </Section>

        <Section title="Education" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2 flex justify-between">
              <div>
                <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
                <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} style={{ color: accent }} />
              </div>
              <div className="text-right text-[10px] text-gray-600">
                <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} />
                <Editable as="div" value={ed.location} onChange={(v)=>update(["education",i,"location"],v)} />
              </div>
            </div>
          ))}
        </Section>
      </div>

      <aside className="w-[34%] p-8 text-white" style={{ background: "#1f2937" }}>
        <SidebarSection title="Achievements" accent={accent}>
          {blocks.achievements((a, i) => (
            <div className="mb-3">
              <Editable as="div" value={a.title} onChange={(v)=>update(["achievements",i,"title"],v)} className="font-bold" style={{ color: accent }} />
              <Editable as="p" value={a.text} onChange={(v)=>update(["achievements",i,"text"],v)} multiline className="text-gray-200 text-[10px] mt-0.5" />
            </div>
          ))}
        </SidebarSection>

        <SidebarSection title="Skills" accent={accent}>
          <EditableList items={data.skills} onChange={(v)=>update(["skills"],v)} className="space-y-1 text-gray-100" bullet="•" />
        </SidebarSection>

        <SidebarSection title="Courses" accent={accent}>
          {blocks.courses((c, i) => (
            <div className="mb-2">
              <Editable as="div" value={c.title} onChange={(v)=>update(["courses",i,"title"],v)} className="font-bold text-[11px]" style={{ color: accent }} />
              <Editable as="p" value={c.text} onChange={(v)=>update(["courses",i,"text"],v)} multiline className="text-gray-200 text-[10px]" />
            </div>
          ))}
        </SidebarSection>

        <SidebarSection title="Languages" accent={accent}>
          {blocks.languages((l, i) => (
            <div className="flex justify-between text-gray-100">
              <Editable as="span" value={l.name} onChange={(v)=>update(["languages",i,"name"],v)} />
              <Editable as="span" value={l.level} onChange={(v)=>update(["languages",i,"level"],v)} className="text-gray-400" />
            </div>
          ))}
        </SidebarSection>
      </aside>
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <section className="mt-5">
      <h2 className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{ color: accent, borderColor: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SidebarSection({ title, accent, children }) {
  return (
    <section className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b border-gray-600" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
