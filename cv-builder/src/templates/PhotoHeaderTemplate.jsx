import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { makeBlocks } from "./blockHelpers";

export default function PhotoHeaderTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800">
      <header className="px-10 py-7 flex items-center gap-6" style={{ background: accent + "15" }}>
        <PhotoUpload value={data.photo} onChange={(v) => update(["photo"], v)} size={110} shape="circle" />
        <div className="flex-1">
          <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-4xl font-extrabold uppercase tracking-wide text-gray-900" />
          <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-1 font-semibold text-[12px]" style={{ color: accent }} />
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-gray-600 text-[10px]">
            <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
            <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
            <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
            <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
          </div>
        </div>
      </header>

      <div className="p-10">
        <Sec title="Summary" accent={accent}>
          <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
        </Sec>

        <Sec title="Experience" accent={accent}>
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
                  />
                  {i < data.skills.length - 1 && (
                    <span className="mx-2 text-gray-400">•</span>
                  )}
                </span>
              ))}
            </div>
          </Sec>
        </div>

        <Sec title="Achievements" accent={accent}>
          {blocks.achievements((a, i) => (
            <div className="mb-2">
              <Editable as="div" value={a.title} onChange={(v)=>update(["achievements",i,"title"],v)} className="font-bold" style={{ color: accent }} />
              <Editable as="p" value={a.text} onChange={(v)=>update(["achievements",i,"text"],v)} multiline className="text-gray-700 text-[10px]" />
            </div>
          ))}
        </Sec>

        <Sec title="Languages" accent={accent}>
          <div className="flex flex-wrap gap-5">
            {blocks.languages((l, i) => (
              <div>
                <Editable as="span" value={l.name} onChange={(v)=>update(["languages",i,"name"],v)} className="font-semibold" />
                {" — "}
                <Editable as="span" value={l.level} onChange={(v)=>update(["languages",i,"level"],v)} className="text-gray-600" />
              </div>
            ))}
          </div>
        </Sec>
      </div>
    </div>
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
