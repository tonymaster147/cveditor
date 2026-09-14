import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Kingston" — page background splits between peach on top (47%) and
// cool grey below, then a white inner card holds a 2-col layout:
// centered stacked name + role over a Contact/Skills/Language sidebar,
// and an Experience/Education/References timeline on the right where
// each item has a black circle marker linked by a thin grey rail.

const PEACH = "#fbddc9";
const COOL_GREY = "#d7dbde";
const DOT = "#3a3a3a";
const RAIL = "#bdbdbd";
const INK = "#3a3a3a";
const BODY = "#555";
const FONT = "'Montserrat', sans-serif";

export default function KingstonTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{
        background: `linear-gradient(to bottom,${PEACH} 0%,${PEACH} 47%,${COOL_GREY} 47%,${COOL_GREY} 100%)`,
        fontFamily: FONT,
        color: "#4c4c4c",
        padding: 22,
        boxSizing: "border-box",
      }}
    >
      <div style={{ background: "#fff", padding: "32px 30px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "215px 1fr", columnGap: 30 }}>
          {/* LEFT */}
          <div>
            <div className="text-center" style={{ marginTop: 40 }}>
              <Editable
                as="h1"
                value={data.name}
                onChange={(v) => update(["name"], v)}
                className="m-0 uppercase"
                style={{ fontWeight: 800, fontSize: 38, lineHeight: 1.02, color: "#4a4a4a", letterSpacing: 1 }}
              />
              <Editable
                as="div"
                value={data.role}
                onChange={(v) => update(["role"], v)}
                style={{ fontSize: 13, letterSpacing: 4, color: "#8a8a8a", marginTop: 10, fontWeight: 500 }}
              />
            </div>

            <RuleTitle text="Contact" mt={46} />
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ fontSize: 11, lineHeight: 1.75, color: BODY, textAlign: "justify", marginTop: 14 }}
            />
            <div className="flex flex-col" style={{ gap: 10, marginTop: 16, fontSize: 11, color: INK }}>
              <IconLine icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconLine>
              <IconLine icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconLine>
              <IconLine icon="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconLine>
            </div>

            <RuleTitle text="Skills" mt={32} />
            <ul className="flex flex-col" style={{ listStyle: "none", marginTop: 14, gap: 10, padding: 0 }}>
              {(data.skills || []).map((s, i) => (
                <li key={i} className="flex items-center" style={{ gap: 10, fontSize: 12.5, color: INK }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: INK, display: "inline-block" }} />
                  {s}
                </li>
              ))}
            </ul>

            <RuleTitle text="Language" mt={30} />
            <ul className="flex flex-col" style={{ listStyle: "none", marginTop: 14, gap: 10, padding: 0 }}>
              {blocks.languages((l, i) => (
                <li key={i} className="flex items-center" style={{ gap: 10, fontSize: 12.5, color: INK }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: INK, display: "inline-block" }} />
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div>
            <RuleTitle text="Experience" size={20} />
            <TimelineList items={data.experience || []} render={blocks.experience} field="experience" update={update} />

            <RuleTitle text="Education" size={20} mt={12} />
            <div style={{ marginTop: 14 }}>
              {blocks.education((ed, i, arr) => (
                <TimelineRow
                  key={i}
                  isLast={i === (data.education || []).length - 1}
                  title={<Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />}
                  meta={<Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />}
                  date={<Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />}
                />
              ))}
            </div>

            <RuleTitle text="References" size={20} mt={12} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
              {blocks.references((r, i) => (
                <div key={i}>
                  <Editable
                    as="div"
                    value={r.name}
                    onChange={(v) => update(["references", i, "name"], v)}
                    style={{ fontWeight: 700, fontSize: 14, color: INK }}
                  />
                  <Editable
                    as="div"
                    value={r.role}
                    onChange={(v) => update(["references", i, "role"], v)}
                    style={{ fontSize: 11.5, color: BODY, marginTop: 2 }}
                  />
                  <div style={{ fontSize: 11, color: "#4a4a4a", marginTop: 10, lineHeight: 1.7 }}>
                    <div><b>Phone:</b>{" "}<Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} /></div>
                    <div><b>Email :</b>{" "}<Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineList({ items, render, field, update }) {
  return (
    <div style={{ marginTop: 14 }}>
      {render((exp, i) => {
        const isLast = i === items.length - 1;
        return (
          <TimelineRow
            key={i}
            isLast={isLast}
            title={<Editable as="span" value={exp.title} onChange={(v) => update([field, i, "title"], v)} />}
            meta={<Editable as="span" value={exp.company} onChange={(v) => update([field, i, "company"], v)} />}
            date={<Editable as="span" value={exp.date} onChange={(v) => update([field, i, "date"], v)} />}
            body={
              <EditableList
                items={exp.bullets}
                onChange={(v) => update([field, i, "bullets"], v)}
                className="king-list"
                bullet="•"
              />
            }
          />
        );
      })}
      <style>{`
        .king-list { margin: 8px 0 0; padding-left: 18px; list-style: disc; }
        .king-list > li { font-size: 11.5px; line-height: 1.6; color: #555; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function TimelineRow({ title, meta, date, body, isLast }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "28px 1fr", marginBottom: 8 }}>
      <div className="flex flex-col items-center">
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: DOT, marginTop: 3, display: "inline-block" }} />
        {!isLast && <span style={{ width: 2, flex: 1, background: RAIL, minHeight: 16 }} />}
      </div>
      <div style={{ paddingBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#3a3a3a" }}>{title}</div>
        <div className="flex justify-between items-baseline">
          <span style={{ fontStyle: "italic", fontSize: 12, color: BODY }}>{meta}</span>
          <span style={{ fontSize: 11, color: BODY }}>{date}</span>
        </div>
        {body}
      </div>
    </div>
  );
}

function RuleTitle({ text, size, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ marginTop: mt || 0 }}>
      <Tag className="m-0" style={{ fontWeight: 700, fontSize: size || 18, color: "#4a4a4a" }}>
        {text}
      </Tag>
      <div style={{ height: 1, background: DOT, marginTop: 6 }} />
    </div>
  );
}

function IconLine({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <span style={{ fontSize: 12, color: "#4a4a4a" }}>{icon}</span>
      {children}
    </div>
  );
}
