import Editable from "../components/Editable";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { makeBlocks } from "./blockHelpers";

export default function PhotoSidebarTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  return (
    <div className="cv-page font-sans text-[11px] leading-snug text-gray-800 flex">
      <aside className="w-[34%] p-8 text-white" style={{ background: "#1e293b" }}>
        <div className="flex justify-center mb-4">
          <PhotoUpload value={data.photo} onChange={(v) => update(["photo"], v)} size={130} shape="circle" />
        </div>

        <Editable as="h1" value={data.name} onChange={(v)=>update(["name"],v)} className="text-2xl font-extrabold uppercase text-center leading-tight" />
        <Editable as="div" value={data.role} onChange={(v)=>update(["role"],v)} className="mt-1 text-center text-[11px]" style={{ color: accent }} />

        <SBSec title="Contact" accent={accent}>
          <div className="space-y-1 text-[10px]">
            <div>📞 <Editable as="span" value={data.phone} onChange={(v)=>update(["phone"],v)} /></div>
            <div>✉ <Editable as="span" value={data.email} onChange={(v)=>update(["email"],v)} /></div>
            <div>🔗 <Editable as="span" value={data.linkedin} onChange={(v)=>update(["linkedin"],v)} /></div>
            <div>📍 <Editable as="span" value={data.location} onChange={(v)=>update(["location"],v)} /></div>
          </div>
        </SBSec>

        <SBSec title="Skills" accent={accent}>
          <EditableList items={data.skills} onChange={(v)=>update(["skills"],v)} className="space-y-1 text-gray-100" bullet="▪" />
        </SBSec>

        <SBSec title="Languages" accent={accent}>
          {blocks.languages((l, i) => (
            <div className="mb-1 flex justify-between text-gray-100">
              <Editable as="span" value={l.name} onChange={(v)=>update(["languages",i,"name"],v)} className="font-semibold" />
              <Editable as="span" value={l.level} onChange={(v)=>update(["languages",i,"level"],v)} className="text-[10px] opacity-80" />
            </div>
          ))}
        </SBSec>
      </aside>

      <div className="flex-1 p-10">
        <Sec title="Profile" accent={accent}>
          <Editable as="p" value={data.summary} onChange={(v)=>update(["summary"],v)} multiline className="text-gray-700" />
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

        <Sec title="Education" accent={accent}>
          {blocks.education((ed, i) => (
            <div className="mb-2 flex justify-between">
              <div>
                <Editable as="div" value={ed.degree} onChange={(v)=>update(["education",i,"degree"],v)} className="font-bold" />
                <Editable as="div" value={ed.school} onChange={(v)=>update(["education",i,"school"],v)} style={{ color: accent }} />
              </div>
              <div className="text-right text-[10px] text-gray-600">
                <Editable as="div" value={ed.date} onChange={(v)=>update(["education",i,"date"],v)} />
                <Editable as="div" value={ed.location} onChange={(v)=>update(["education",i,"location"],v)} />
              </div>
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

function SBSec({ title, accent, children }) {
  return (
    <section className="mt-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2 border-b border-white/30" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
