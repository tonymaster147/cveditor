import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

export default function ElegantTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-serif text-[11px] leading-relaxed text-gray-800 p-14">
      <header className="text-center mb-8">
        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-5xl font-light tracking-[0.1em] uppercase text-gray-900" />
        <div className="w-24 h-px mx-auto my-3" style={{ background: accent }} />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="italic text-[12px] text-gray-600" />
        <div className="flex justify-center flex-wrap gap-x-5 gap-y-1 mt-3 text-[10px] text-gray-500">
          <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} />
          <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} />
          <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} />
          <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} />
        </div>
      </header>

      <Sec title="Profile" accent={accent}>
        <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline className="text-center italic" />
      </Sec>

      <Sec title="Experience" accent={accent}>
        {blocks.experience((exp, i) => (
          <div className="mb-4 text-center">
            <Editable as="h3" value={exp.title} onChange={(v)=>update(["experience",i,"title"],v)} className="font-bold text-gray-900" />
            <div className="italic text-[10.5px]">
              <Editable as="span" value={exp.company} onChange={(v)=>update(["experience",i,"company"],v)} style={{ color: accent }} /> · <Editable as="span" value={exp.date} onChange={(v)=>update(["experience",i,"date"],v)} className="text-gray-600" /> · <Editable as="span" value={exp.location} onChange={(v)=>update(["experience",i,"location"],v)} className="text-gray-600" />
            </div>
            <EditableList items={exp.bullets} onChange={(v)=>update(["experience",i,"bullets"],v)} className="mt-1 space-y-0.5 text-left max-w-[90%] mx-auto" bullet="—" />
          </div>
        ))}
      </Sec>

      <div className="grid grid-cols-2 gap-8">
        <Sec title="Education" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2 text-center">
              <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
              <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} className="italic" />
              <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} className="text-[10px] text-gray-600" />
            </div>
          ))}
        </Sec>
        <Sec title="Skills" accent={accent}>
          <Editable
            as="p"
            value={data.skills.join(" · ")}
            onChange={(v) => update(["skills"], v.split("·").map((s) => s.trim()).filter(Boolean))}
            multiline
            className="text-center"
          />
        </Sec>
      </div>
    </div>
  );
}

function Sec({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="mb-6">
      <Tag className="text-xs font-medium uppercase tracking-[0.4em] text-center mb-3" style={{ color: accent }}>
        {title}
      </Tag>
      {children}
    </section>
  );
}
