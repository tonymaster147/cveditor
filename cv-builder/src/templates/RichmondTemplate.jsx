import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Richmond" — Oswald monochrome CV inside a double border. Big tracked-out
// Oswald name in black over a small black chip pill for the role. Body is
// a two-column grid: left (Profile + Experience), right (Education +
// Skills). Bottom-right holds a dark charcoal contact card that spills to
// the right edge of the inner frame.

const DARK = "#1c1c1c";
const RULE = "#cfcfcf";
const BORDER = "#d5d5d5";
const BODY = "#555";
const MUTED = "#777";
const OSWALD = "'Oswald', sans-serif";
const MONT = "'Montserrat', Helvetica, Arial, sans-serif";

export default function RichmondTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page box-border"
      style={{ background: "#fff", fontFamily: MONT, color: BODY, padding: 20, overflow: "hidden" }}
    >
      {/* INNER BORDERED FRAME */}
      <div style={{ border: `1px solid ${BORDER}`, padding: "30px 32px 0", overflow: "hidden" }}>
        {/* HEADER */}
        <div className="flex flex-col" style={{ paddingBottom: 24, borderBottom: `1px solid ${BORDER}` }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{
              fontFamily: OSWALD,
              fontSize: 56,
              fontWeight: 400,
              letterSpacing: "0.04em",
              color: DARK,
              lineHeight: 0.9,
            }}
          />
          <div
            className="self-start uppercase"
            style={{
              background: DARK,
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.55em",
              padding: "6px 14px 6px 18px",
              marginTop: 12,
            }}
          >
            <Editable as="span" value={data.role} onChange={(v) => update(["role"], v)} />
          </div>
        </div>

        {/* TWO COLUMNS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 40px",
            padding: "30px 0 0",
          }}
        >
          {/* LEFT */}
          <div className="flex flex-col" style={{ gap: 26 }}>
            <Section title="Profile">
              <Editable
                as="p"
                value={data.summary}
                onChange={(v) => update(["summary"], v)}
                multiline
                style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: BODY }}
              />
            </Section>

            <Section title="Experience">
              <div className="flex flex-col" style={{ gap: 18, fontSize: 13, color: BODY }}>
                {blocks.experience((exp, i) => (
                  <div key={i}>
                    <Editable
                      as="div"
                      value={exp.title}
                      onChange={(v) => update(["experience", i, "title"], v)}
                      className="uppercase"
                      style={{ fontWeight: 700, letterSpacing: "0.06em", color: DARK }}
                    />
                    <Editable as="div" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                    <Editable
                      as="div"
                      value={exp.date}
                      onChange={(v) => update(["experience", i, "date"], v)}
                      style={{ color: MUTED }}
                    />
                    <EditableList
                      items={exp.bullets}
                      onChange={(v) => update(["experience", i, "bullets"], v)}
                      className="rich-list"
                      bullet="•"
                    />
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col" style={{ gap: 26 }}>
            <Section title="Education">
              <div className="flex flex-col" style={{ gap: 14, fontSize: 13, color: BODY }}>
                {blocks.education((ed, i) => (
                  <div key={i}>
                    <Editable
                      as="div"
                      value={ed.school}
                      onChange={(v) => update(["education", i, "school"], v)}
                      className="uppercase"
                      style={{ fontWeight: 700, letterSpacing: "0.06em", color: DARK }}
                    />
                    <Editable as="div" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                    <Editable
                      as="div"
                      value={ed.date}
                      onChange={(v) => update(["education", i, "date"], v)}
                      style={{ color: MUTED }}
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Skills">
              <EditableList
                items={data.skills}
                onChange={(v) => update(["skills"], v)}
                className="rich-skill-list"
                bullet="•"
              />
            </Section>
          </div>
        </div>

        {/* DARK CONTACT BAR — spans the right column, spills to the right edge */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 40px",
            margin: "24px 0 0",
          }}
        >
          <div />
          <div
            className="flex flex-col"
            style={{
              background: DARK,
              color: "#fff",
              padding: "22px 24px",
              gap: 12,
              fontSize: 13,
              marginRight: -32,
            }}
          >
            <div className="flex items-center" style={{ gap: 12 }}>
              <span>✆</span>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span>✉</span>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span>●</span>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <span>🌐</span>
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </div>
          </div>
        </div>

        <style>{`
          .rich-list { margin: 6px 0 0; padding-left: 18px; list-style: disc; }
          .rich-list > li { font-size: 12.5px; line-height: 1.55; color: ${BODY}; margin-bottom: 3px; }
          .rich-skill-list { margin: 0; padding-left: 18px; list-style: disc; }
          .rich-skill-list > li { font-size: 13px; line-height: 1.7; color: ${BODY}; margin-bottom: 3px; }
        `}</style>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="flex flex-col" style={{ gap: 14 }}>
      <Tag
        className="uppercase m-0"
        style={{ fontSize: 18, fontWeight: 600, letterSpacing: "0.4em", color: DARK }}
      >
        {title}
      </Tag>
      <div style={{ height: 1, background: RULE, marginTop: -8 }} />
      {children}
    </section>
  );
}
