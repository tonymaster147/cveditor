import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function BoldHeaderTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800">
      <header className="px-10 py-6 text-white" style={{ background: accent }}>
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-5xl font-black uppercase tracking-tight" />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-1 text-[13px] font-medium opacity-95" />
      </header>
      <div className="px-10 py-3 bg-gray-100 text-[10px] flex flex-wrap gap-x-5 gap-y-1 text-gray-700">
        <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
        <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
        <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
        <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
      </div>

      <div className="p-10">
        <Sec title="Profile" accent={accent}>
          <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
        </Sec>

        <Sec title="Experience" accent={accent}>
          {blocks.experience((exp, i) => (
            <div className="mb-3">
              <div className="flex justify-between">
                <Editable as="h3" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-bold text-gray-900" />
                <Editable as="span" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} className="text-[10px] text-gray-600" />
              </div>
              <Editable as="div" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} className="font-semibold" style={{ color: accent }} />
              <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5" bullet="•" />
            </div>
          ))}
        </Sec>

        <div className="grid grid-cols-2 gap-6">
          <Sec title="Education" accent={accent}>
            {blocks.education((ed, i) => (
              <div className="mb-2">
                <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
                <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} className="text-gray-700" />
                <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} className="text-[10px] text-gray-600" />
              </div>
            ))}
          </Sec>
          <Sec title="Skills" accent={accent}>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <Editable
                  key={i}
                  as="span"
                  value={s}
                  onChange={(v) => {
                    const next = data.skills.slice();
                    next[i] = v;
                    update(["skills"], next);
                  }}
                  className="px-2 py-0.5 rounded-full text-[10px] text-white"
                  style={{ background: accent }}
                />
              ))}
            </div>
          </Sec>
        </div>
      </div>
    </div>
  );
}

function Sec({ title, accent, children }) {
  return (
    <section className="mb-5">
      <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
