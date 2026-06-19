import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function ExecutiveTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-serif text-[11px] leading-snug text-gray-800">
      <header className="px-12 py-8 text-white" style={{ background: "#111827" }}>
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-4xl font-bold uppercase tracking-wide" />
        <div className="w-16 h-0.5 my-2" style={{ background: accent }} />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="text-[12px] tracking-wider uppercase" style={{ color: accent }} />
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[10px] text-gray-300">
          <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
          <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
          <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
          <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
        </div>
      </header>

      <div className="p-12">
        <Sec title="Executive Summary" accent={accent}>
          <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
        </Sec>

        <Sec title="Career Experience" accent={accent}>
          {blocks.experience((exp, i) => (
            <div className="mb-4">
              <div className="flex justify-between items-baseline">
                <Editable as="h3" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-bold uppercase tracking-wide text-gray-900" />
                <Editable as="span" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} className="text-[10px] font-semibold" style={{ color: accent }} />
              </div>
              <div className="italic text-gray-600">
                <Editable as="span" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} />, <Editable as="span" value={exp.location} onChange={(v)=>update(["experience",i,"location"],v)} />
              </div>
              <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5" bullet="▪" />
            </div>
          ))}
        </Sec>

        <div className="grid grid-cols-2 gap-8">
          <Sec title="Education" accent={accent}>
            {blocks.education((ed, i) => (
              <div className="mb-2">
                <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
                <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} className="italic" />
                <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} className="text-[10px] text-gray-600" />
              </div>
            ))}
          </Sec>

          <Sec title="Core Competencies" accent={accent}>
            <EditableList items={data.skills} onChange={(v)=>update(["skills"],v)} className="space-y-0.5" bullet="◆" />
          </Sec>
        </div>
      </div>
    </div>
  );
}

function Sec({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mb-5">
      <Tag className="text-sm font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>
        {title}
      </Tag>
      {children}
    </section>
  );
}
