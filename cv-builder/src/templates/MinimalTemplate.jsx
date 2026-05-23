import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function MinimalTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-relaxed text-gray-700 p-16">
      <header className="mb-8">
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-5xl font-light tracking-tight text-gray-900" />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-2 text-gray-500 text-[12px]" />
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-[10px] text-gray-500">
          <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
          <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
          <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
          <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
        </div>
      </header>

      <Sec title="About" accent={accent}>
        <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
      </Sec>

      <Sec title="Experience" accent={accent}>
        {blocks.experience((exp, i) => (
          <div className="mb-4 pl-4 border-l-2" style={{ borderColor: accent + "55" }}>
            <Editable as="div" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-semibold text-gray-900" />
            <div className="text-[10px] text-gray-500">
              <Editable as="span" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} /> · <Editable as="span" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} /> · <Editable as="span" value={exp.location} onChange={(v)=>update(["experience",i,"location"],v)} />
            </div>
            <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5" bullet="–" />
          </div>
        ))}
      </Sec>

      <div className="grid grid-cols-2 gap-8">
        <Sec title="Education" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2">
              <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-semibold text-gray-900" />
              <div className="text-[10px] text-gray-500">
                <Editable as="span" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} /> · <Editable as="span" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} />
              </div>
            </div>
          ))}
        </Sec>

        <Sec title="Skills" accent={accent}>
          <EditableList items={data.skills} onChange={(v)=>update(["skills"],v)} className="space-y-0.5" bullet="" />
        </Sec>
      </div>
    </div>
  );
}

function Sec({ title, accent, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-[10px] font-medium uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
