import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function ClassicTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-serif text-[11px] leading-snug text-gray-800 p-12">
      <header className="text-center border-b-2 border-gray-800 pb-3 mb-4">
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-4xl font-bold uppercase tracking-[0.15em] text-gray-900" />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-1 italic text-gray-700" />
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-gray-600">
          <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
          <span>·</span>
          <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
          <span>·</span>
          <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
          <span>·</span>
          <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
        </div>
      </header>

      <Sec title="Summary" accent={accent}>
        <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline />
      </Sec>

      <Sec title="Professional Experience" accent={accent}>
        {blocks.experience((exp, i) => (
          <div className="mb-3">
            <div className="flex justify-between">
              <Editable as="span" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-bold" />
              <Editable as="span" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} className="text-[10px] text-gray-600" />
            </div>
            <div className="flex justify-between italic">
              <Editable as="span" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} />
              <Editable as="span" value={exp.location} onChange={(v)=>update(["experience",i,"location"],v)} className="text-[10px]" />
            </div>
            <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5" bullet="•" />
          </div>
        ))}
      </Sec>

      <Sec title="Education" accent={accent}>
        {blocks.education((ed, i) => (
          <div className="flex justify-between mb-1">
            <div>
              <Editable as="span" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
              {" — "}
              <Editable as="span" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} className="italic" />
            </div>
            <Editable as="span" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} className="text-[10px] text-gray-600" />
          </div>
        ))}
      </Sec>

      <Sec title="Skills" accent={accent}>
        <Editable
          as="p"
          value={data.skills.join(" · ")}
          onChange={(v) => update(["skills"], v.split("·").map((s) => s.trim()).filter(Boolean))}
          multiline
        />
      </Sec>

      <Sec title="Languages" accent={accent}>
        <div className="flex gap-6">
          {blocks.languages((l, i) => (
            <div>
              <Editable as="span" value={l.name} onChange={(v)=>update(["languages",i,"name"],v)} className="font-semibold" />
              {" — "}
              <Editable as="span" value={l.level} onChange={(v)=>update(["languages",i,"level"],v)} className="italic" />
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

function Sec({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mb-4">
      <Tag className="text-sm font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-2" style={{ color: accent }}>
        {title}
      </Tag>
      {children}
    </section>
  );
}
