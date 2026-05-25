import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function StylishTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800 p-12">
      <header className="border-b-2 pb-4 mb-5" style={{ borderColor: accent }}>
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-4xl font-extrabold uppercase tracking-wide text-gray-900" />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-1 font-semibold text-[13px]" style={{ color: accent }} />
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-gray-600 text-[10px]">
          <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
          <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
          <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
          <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
        </div>
      </header>

      <Block title="Summary" accent={accent}>
        <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
      </Block>

      <Block title="Experience" accent={accent}>
        {blocks.experience((exp, i) => (
          <div className="mb-4 grid grid-cols-[140px_1fr] gap-4">
            <div className="text-[10px] text-gray-600">
              <Editable as="div" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} className="font-semibold" />
              <Editable as="div" value={exp.location} onChange={(v)=>update(["experience",i,"location"],v)} />
            </div>
            <div>
              <Editable as="h3" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-bold text-gray-900" />
              <Editable as="div" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} className="font-semibold" style={{ color: accent }} />
              <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5" bullet="•" />
            </div>
          </div>
        ))}
      </Block>

      <Block title="Achievements" accent={accent}>
        <div className="grid grid-cols-2 gap-3">
          {blocks.achievements((a, i) => (
            <div>
              <Editable as="div" value={a.title} onChange={(v)=>update(["achievements",i,"title"],v)} className="font-bold" style={{ color: accent }} />
              <Editable as="p" value={a.text} onChange={(v)=>update(["achievements",i,"text"],v)} multiline className="text-gray-700 text-[10px]" />
            </div>
          ))}
        </div>
      </Block>

      <div className="grid grid-cols-2 gap-6">
        <Block title="Education" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2">
              <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
              <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} style={{ color: accent }} />
              <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} className="text-[10px] text-gray-600" />
            </div>
          ))}
        </Block>

        <Block title="Skills" accent={accent}>
          <div className="text-[11px] text-gray-800 leading-relaxed">
            {data.skills.map((s, i) => (
              <span key={i}>
                <Editable
                  as="span"
                  value={s}
                  onChange={(v) => {
                    const next = data.skills.slice();
                    next[i] = v;
                    update(["skills"], next);
                  }}
                  style={{ color: accent }}
                />
                {i < data.skills.length - 1 && (
                  <span className="mx-2 text-gray-400">•</span>
                )}
              </span>
            ))}
          </div>
        </Block>
      </div>

      <Block title="Languages" accent={accent}>
        <div className="flex flex-wrap gap-6">
          {blocks.languages((l, i) => (
            <div>
              <Editable as="span" value={l.name} onChange={(v)=>update(["languages",i,"name"],v)} className="font-bold" />
              {" — "}
              <Editable as="span" value={l.level} onChange={(v)=>update(["languages",i,"level"],v)} className="text-gray-600" />
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}

function Block({ title, accent, children }) {
  return (
    <section className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
