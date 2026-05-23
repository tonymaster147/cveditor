import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function CreativeSplitTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800 flex">
      <aside className="w-[36%] p-8 text-white" style={{ background: accent }}>
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-3xl font-extrabold uppercase leading-tight" />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-2 text-[12px] opacity-90" />

        <div className="mt-6 space-y-1.5 text-[10px]">
          <div>📞 <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} /></div>
          <div>✉ <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} /></div>
          <div>🔗 <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} /></div>
          <div>📍 <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} /></div>
        </div>

        <SBSec title="Skills">
          <EditableList items={data.skills} onChange={(v)=>update(["skills"],v)} className="space-y-1" bullet="▪" />
        </SBSec>

        <SBSec title="Languages">
          {blocks.languages((l, i) => (
            <div className="mb-1">
              <Editable as="div" value={l.name} onChange={(v)=>update(["languages",i,"name"],v)} className="font-semibold" />
              <Editable as="div" value={l.level} onChange={(v)=>update(["languages",i,"level"],v)} className="text-[10px] opacity-80" />
            </div>
          ))}
        </SBSec>

        <SBSec title="Education">
          {blocks.education((ed, i) => (
            <div className="mb-2">
              <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold text-[10.5px]" />
              <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} className="text-[10px] opacity-90" />
              <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} className="text-[10px] opacity-70" />
            </div>
          ))}
        </SBSec>
      </aside>

      <main className="flex-1 p-10">
        <Sec title="Summary" accent={accent}>
          <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
        </Sec>

        <Sec title="Experience" accent={accent}>
          {blocks.experience((exp, i) => (
            <div className="mb-4">
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
        </Sec>

        <Sec title="Achievements" accent={accent}>
          {blocks.achievements((a, i) => (
            <div className="mb-2">
              <Editable as="div" value={a.title} onChange={(v)=>update(["achievements",i,"title"],v)} className="font-bold" style={{ color: accent }} />
              <Editable as="p" value={a.text} onChange={(v)=>update(["achievements",i,"text"],v)} multiline className="text-gray-700 text-[10px]" />
            </div>
          ))}
        </Sec>
      </main>
    </div>
  );
}

function SBSec({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest border-b border-white/40 pb-1 mb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Sec({ title, accent, children }) {
  return (
    <section className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{ color: accent, borderColor: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
