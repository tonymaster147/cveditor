import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function TimelineTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800 p-12">
      <header className="flex justify-between items-end border-b pb-4 mb-5" style={{ borderColor: accent }}>
        <div>
          <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-4xl font-bold text-gray-900" />
          <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-1 font-semibold" style={{ color: accent }} />
        </div>
        <div className="text-right text-[10px] text-gray-600 space-y-0.5">
          <div><Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} /></div>
          <div><Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} /></div>
          <div><Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} /></div>
          <div><Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} /></div>
        </div>
      </header>

      <Sec title="Summary" accent={accent}>
        <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
      </Sec>

      <Sec title="Experience" accent={accent}>
        <div className="relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-0.5" style={{ background: accent + "55" }} />
          {blocks.experience((exp, i) => (
            <div className="mb-4 relative">
              <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full" style={{ background: accent }} />
              <Editable as="h3" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-bold text-gray-900" />
              <div className="flex justify-between text-[10px]">
                <Editable as="span" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} className="font-semibold" style={{ color: accent }} />
                <span className="text-gray-600">
                  <Editable as="span" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} /> · <Editable as="span" value={exp.location} onChange={(v)=>update(["experience",i,"location"],v)} />
                </span>
              </div>
              <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5" bullet="•" />
            </div>
          ))}
        </div>
      </Sec>

      <div className="grid grid-cols-2 gap-6">
        <Sec title="Education" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2">
              <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
              <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} style={{ color: accent }} />
              <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} className="text-[10px] text-gray-600" />
            </div>
          ))}
        </Sec>
        <Sec title="Skills" accent={accent}>
          <EditableList items={data.skills} onChange={(v)=>update(["skills"],v)} className="space-y-0.5" bullet="▸" />
        </Sec>
      </div>
    </div>
  );
}

function Sec({ title, accent, children }) {
  return (
    <section className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
