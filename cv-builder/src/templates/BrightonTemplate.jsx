import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Brighton" — creative, vibrant CV. Blue→purple→pink gradient header with
// a centered Playfair name and pale-lilac subtitle. Grey (#f4f4f4) page
// with a 300px transparent left column (Contact / Education / Skills /
// Language) and a white right column (About Me / Experience / References).
// Section titles use a full-width thin grey rule.

const PAGE_BG = "#f4f4f4";
const RULE = "#c9c9c9";
const HEADING = "#2b2b2b";
const BODY = "#444";
const SOFT = "#555";
const MUTED = "#666";
const SANS = "'Poppins', sans-serif";
const SERIF = "'Playfair Display', serif";

const HEADER_GRADIENT =
  "linear-gradient(90deg,#5b6ef5 0%,#a24bd6 50%,#f24aa0 100%)";

export default function BrightonTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ background: PAGE_BG, fontFamily: SANS, color: "#333" }}>
      {/* HEADER — vibrant gradient */}
      <div className="text-center" style={{ background: HEADER_GRADIENT, padding: "52px 40px 40px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 600, letterSpacing: 6, color: "#ffffff", lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontFamily: SERIF, fontSize: 24, color: "#f5eafc", marginTop: 12 }}
        />
      </div>

      {/* BODY */}
      <div className="flex flex-1">
        {/* LEFT — transparent over grey page */}
        <div className="flex-none box-border" style={{ width: 300, padding: "36px 30px 50px" }}>
          <Section title="Contact" mt={0} />
          <div className="flex flex-col" style={{ marginTop: 18, gap: 14, fontSize: 13.5, color: BODY }}>
            <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
            <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} />
            <Editable as="div" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} />
          </div>

          <Section title="Education" mt={32} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 16 }}>
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13.5, fontStyle: "italic", color: MUTED }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontWeight: 700, fontSize: 14.5, color: HEADING, marginTop: 4 }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontSize: 13.5, color: SOFT }}
              />
            </div>
          ))}

          <Section title="Skills" mt={32} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="bri-list"
            bullet="•"
          />

          <Section title="Language" mt={32} />
          <ul className="bri-list">
            {blocks.languages((l, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="shrink-0">•</span>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <style>{`
            .bri-list { margin: 16px 0 0; padding-left: 6px; list-style: none; }
            .bri-list > li { font-size: 14px; line-height: 2.1; color: ${BODY}; }
          `}</style>
        </div>

        {/* RIGHT — white card */}
        <div
          className="flex-1 box-border"
          style={{ background: "#ffffff", padding: "36px 40px 50px" }}
        >
          <Section title="About Me" mt={0} />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14, lineHeight: 1.85, color: SOFT, margin: "16px 0 0", textAlign: "justify" }}
          />

          <Section title="Experience" mt={30} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 18 : 20 }}>
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 13.5, fontStyle: "italic", color: MUTED }}
              />
              <div style={{ fontSize: 15, color: "#333", marginTop: 4 }}>
                <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
              </div>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                style={{ fontWeight: 700, fontSize: 15, color: HEADING, marginTop: 4 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="bri-exp-list"
                bullet="•"
              />
            </div>
          ))}

          <Section title="References" mt={30} />
          <div className="flex" style={{ gap: 30, marginTop: 18 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontWeight: 700, fontSize: 15, color: HEADING }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 14, color: BODY, marginTop: 2 }}
                />
                <div style={{ fontSize: 12.5, color: "#333", marginTop: 8 }}>
                  <b>Phone:</b>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                </div>
                <div style={{ fontSize: 12.5, color: "#333", marginTop: 4 }}>
                  <b>Email :</b>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .bri-exp-list { margin: 8px 0 0; padding-left: 6px; list-style: none; }
            .bri-exp-list > li { font-size: 13px; line-height: 1.6; color: ${MUTED}; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function Section({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag style={{ fontSize: 24, fontWeight: 700, color: HEADING, marginTop: mt ?? 30 }}>
        {title}
      </Tag>
      <div style={{ height: 1, background: RULE, marginTop: 10 }} />
    </>
  );
}
