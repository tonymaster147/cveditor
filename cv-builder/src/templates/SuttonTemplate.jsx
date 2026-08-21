import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Sutton" — clean minimal CV in Poppins. Big tracked-out name + thin
// role subtitle, thick black divider, career summary. Body 2-col:
// left (Contact icons / Education / Skills bullet list) + right (Work
// Experience as a hollow-circle timeline + References 2-col grid).

const INK = "#2b2b2b";
const SOFT = "#3a3a3a";
const MUTED = "#4a4a4a";
const FONT = "'Poppins', sans-serif";

export default function SuttonTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const total = (data.experience || []).length;

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: FONT, color: INK, padding: "48px 48px 40px", boxSizing: "border-box" }}>
      <Editable
        as="h1"
        value={data.name}
        onChange={(v) => update(["name"], v)}
        className="m-0 uppercase"
        style={{ fontWeight: 700, fontSize: 44, letterSpacing: 4, color: INK, lineHeight: 1 }}
      />
      <Editable
        as="div"
        value={data.role}
        onChange={(v) => update(["role"], v)}
        style={{ fontWeight: 300, fontSize: 19, letterSpacing: 5, color: MUTED, marginTop: 4 }}
      />
      <div style={{ borderBottom: `3px solid ${INK}`, marginTop: 16 }} />

      <SectionTitle text="Career Summary" mt={28} />
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ fontWeight: 300, fontSize: 14, lineHeight: 1.55, textAlign: "justify", color: INK, marginTop: 10 }}
      />

      <div className="flex" style={{ marginTop: 32 }}>
        <div style={{ width: "40%", paddingRight: 30 }}>
          <SectionTitle text="Contact" />
          <div className="flex flex-col" style={{ gap: 10, marginTop: 14, fontWeight: 300, fontSize: 14 }}>
            <IconRow letter="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconRow>
            <IconRow letter="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconRow>
            <IconRow letter="🌐"><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></IconRow>
            <IconRow letter="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconRow>
          </div>

          <SectionTitle text="Education" mt={28} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 14 : 16 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 600, fontSize: 14 }}
              />
              <div style={{ fontWeight: 300, fontSize: 13.5, lineHeight: 1.35, marginTop: 3 }}>
                <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                <br />
                <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            </div>
          ))}

          <SectionTitle text="Skills" mt={28} />
          <ul style={{ listStyle: "none", fontWeight: 300, fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>
            {(data.skills || []).map((s, i) => (
              <li key={i} style={{ display: "flex", gap: 10 }}>
                <span>•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ width: "60%", paddingLeft: 14 }}>
          <SectionTitle text="Work Experience" />
          <div style={{ marginTop: 16 }}>
            {blocks.experience((exp, i) => {
              const isLast = i === total - 1;
              return (
                <div key={i} className="flex" style={{ gap: 14 }}>
                  <div className="flex flex-col items-center" style={{ paddingTop: 4 }}>
                    <span style={{ width: 12, height: 12, border: `2px solid ${INK}`, borderRadius: "50%", flex: "none" }} />
                    {!isLast && <span style={{ width: 2, flex: 1, background: INK, marginTop: 2, minHeight: 30 }} />}
                  </div>
                  <div style={{ paddingBottom: isLast ? 6 : 20 }}>
                    <Editable
                      as="div"
                      value={exp.title}
                      onChange={(v) => update(["experience", i, "title"], v)}
                      style={{ fontWeight: 600, fontSize: 15 }}
                    />
                    <div style={{ fontWeight: 300, fontSize: 13.5, lineHeight: 1.4 }}>
                      <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                      <br />
                      <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                    </div>
                    <EditableList
                      items={exp.bullets}
                      onChange={(v) => update(["experience", i, "bullets"], v)}
                      className="sut-list"
                      bullet="•"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <SectionTitle text="Reference" mt={20} />
          <div className="flex" style={{ gap: 28, marginTop: 14 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable as="div" value={r.name} onChange={(v) => update(["references", i, "name"], v)} style={{ fontWeight: 600, fontSize: 15 }} />
                <Editable as="div" value={r.role} onChange={(v) => update(["references", i, "role"], v)} style={{ fontWeight: 300, fontSize: 13.5 }} />
                <div style={{ fontSize: 12, marginTop: 10 }}>
                  <b style={{ fontWeight: 600 }}>Phone:</b>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  <b style={{ fontWeight: 600 }}>Email :</b>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sut-list { list-style: none; margin-top: 10px; padding-left: 0; }
        .sut-list > li { font-weight: 300; font-size: 13.5px; line-height: 1.5; margin-bottom: 4px; }
      `}</style>
    </div>
  );
}

function SectionTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{ fontWeight: 400, fontSize: 20, letterSpacing: 5, color: SOFT, marginTop: mt || 0 }}
    >
      {text}
    </Tag>
  );
}

function IconRow({ letter, children }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <span style={{ color: INK, fontSize: 13 }}>{letter}</span>
      {children}
    </div>
  );
}
