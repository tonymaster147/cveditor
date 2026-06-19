import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function DoubleColumnTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800 p-10">
      <header className="mb-4">
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-3xl font-bold uppercase text-gray-900" />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-1 font-semibold" style={{ color: accent }} />
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-gray-600 text-[10px]">
          <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
          <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
          <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
          <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
        </div>
      </header>

      <div className="grid grid-cols-[1.6fr_1fr] gap-6">
        <main>
          <Sec title="Summary" accent={accent}>
            <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
          </Sec>

          <Sec title="Experience" accent={accent}>
            {blocks.experience((exp, i) => (
              <div className="mb-3">
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

          <Sec title="Education" accent={accent}>
            {blocks.education((ed, i) => (
              <div className="mb-2">
                <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
                <div className="flex justify-between text-[10px]">
                  <Editable as="span" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} style={{ color: accent }} />
                  <span className="text-gray-600">
                    <Editable as="span" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} />
                  </span>
                </div>
              </div>
            ))}
          </Sec>
        </main>

        <aside>
          <Sec title="Achievements" accent={accent}>
            {blocks.achievements((a, i) => (
              <div className="mb-2">
                <Editable as="div" value={a.title} onChange={(v)=>update(["achievements",i,"title"],v)} className="font-bold" style={{ color: accent }} />
                <Editable as="p" value={a.text} onChange={(v)=>update(["achievements",i,"text"],v)} multiline className="text-gray-700 text-[10px]" />
              </div>
            ))}
          </Sec>

          <Sec title="Skills" accent={accent}>
            <EditableList items={data.skills} onChange={(v)=>update(["skills"],v)} className="space-y-1" bullet="▸" />
          </Sec>

          <Sec title="Courses" accent={accent}>
            {blocks.courses((c, i) => (
              <div className="mb-2">
                <Editable as="div" value={c.title} onChange={(v)=>update(["courses",i,"title"],v)} className="font-bold text-[10.5px]" style={{ color: accent }} />
                <Editable as="p" value={c.text} onChange={(v)=>update(["courses",i,"text"],v)} multiline className="text-gray-700 text-[10px]" />
              </div>
            ))}
          </Sec>

          <Sec title="Languages" accent={accent}>
            {blocks.languages((l, i) => (
              <div className="flex justify-between">
                <Editable as="span" value={l.name} onChange={(v)=>update(["languages",i,"name"],v)} className="font-semibold" />
                <Editable as="span" value={l.level} onChange={(v)=>update(["languages",i,"level"],v)} className="text-gray-600" />
              </div>
            ))}
          </Sec>
        </aside>
      </div>
    </div>
  );
}

function Sec({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mb-4">
      <Tag className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{ color: accent, borderColor: accent }}>
        {title}
      </Tag>
      {children}
    </section>
  );
}
