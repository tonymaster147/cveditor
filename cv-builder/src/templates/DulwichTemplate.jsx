import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Dulwich" — Oswald teal name on cream page, right-aligned tracked-out
// subtitle. Body is a two-column with a bordered left sidebar (Contact /
// Education / Skills) that overlaps upward into the header, and a right
// main column (Profile / Experience). Section headings use a » marker
// plus Oswald semibold teal caps.

const TEAL = "#3a7ca5";
const CREAM = "#f4f2ec";
const BORDER = "#b7bdc2";
const INK = "#3a4045";
const BODY = "#4a4f54";
const MUTED = "#7a8085";
const SUB = "#5b6166";

const OSWALD = "'Oswald', sans-serif";
const NUNITO = "'Nunito Sans', Helvetica, Arial, sans-serif";

export default function DulwichTemplate({ data, update, accent }) {
  const blocks = makeBlocks(data, update);
  const ACCENT = accent || TEAL;

  return (
    <div
      className="cv-page"
      style={{ background: CREAM, fontFamily: NUNITO, color: BODY, position: "relative", overflow: "hidden" }}
    >
      {/* HEADER — right-aligned name + spaced role */}
      <header className="flex flex-col items-end text-right" style={{ padding: "48px 48px 26px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{
            fontFamily: OSWALD,
            fontSize: 50,
            fontWeight: 700,
            color: ACCENT,
            lineHeight: 0.95,
            letterSpacing: "0.01em",
          }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{
            fontFamily: OSWALD,
            fontSize: 17,
            fontWeight: 400,
            letterSpacing: "0.5em",
            color: SUB,
            marginTop: 6,
            paddingRight: "0.1em",
          }}
        />
      </header>

      {/* BODY */}
      <div className="flex" style={{ padding: "0 48px 40px 30px", gap: 0 }}>
        {/* SIDEBAR — bordered, overlaps upward into the header */}
        <aside
          className="flex-none box-border flex flex-col"
          style={{
            width: 280,
            border: `1px solid ${BORDER}`,
            padding: "30px 24px",
            background: CREAM,
            marginTop: -110,
            gap: 26,
          }}
        >
          <SideSection title="Contact" accent={ACCENT}>
            <div className="flex flex-col" style={{ gap: 10, fontSize: 13, color: BODY }}>
              <Row icon="✆" color={ACCENT}>
                <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
              </Row>
              <Row icon="✉" color={ACCENT}>
                <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
              </Row>
              <Row icon="●" color={ACCENT}>
                <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
              </Row>
              <Row icon="🌐" color={ACCENT}>
                <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
              </Row>
            </div>
          </SideSection>

          <SideSection title="Education" accent={ACCENT}>
            <div className="flex flex-col" style={{ gap: 16, fontSize: 13, color: MUTED }}>
              {blocks.education((ed, i) => (
                <div key={i}>
                  <Editable as="div" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} style={{ color: BODY }} />
                  <Editable
                    as="div"
                    value={ed.school}
                    onChange={(v) => update(["education", i, "school"], v)}
                    className="uppercase"
                    style={{ fontWeight: 800, color: INK, letterSpacing: "0.02em" }}
                  />
                  <Editable as="div" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                </div>
              ))}
            </div>
          </SideSection>

          <SideSection title="Skills" accent={ACCENT}>
            <EditableList
              items={data.skills}
              onChange={(v) => update(["skills"], v)}
              className="dul-list"
              bullet="•"
            />
          </SideSection>
        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col" style={{ paddingLeft: 32, gap: 26 }}>
          <MainSection title="Profile" accent={ACCENT}>
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: BODY }}
            />
          </MainSection>

          <MainSection title="Experience" accent={ACCENT}>
            <div className="flex flex-col" style={{ gap: 18, fontSize: 13, color: MUTED }}>
              {blocks.experience((exp, i) => (
                <div key={i}>
                  <Editable as="div" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} style={{ color: BODY }} />
                  <Editable as="div" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} style={{ fontSize: 15, color: INK }} />
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    className="uppercase"
                    style={{ fontWeight: 800, color: ACCENT, letterSpacing: "0.05em", margin: "2px 0 6px" }}
                  />
                  <EditableList
                    items={exp.bullets}
                    onChange={(v) => update(["experience", i, "bullets"], v)}
                    className="dul-exp-list"
                    bullet="•"
                  />
                </div>
              ))}
            </div>
          </MainSection>
        </div>
      </div>

      <style>{`
        .dul-list { margin: 0; padding-left: 18px; list-style: disc; }
        .dul-list > li { font-size: 13px; line-height: 1.55; color: ${MUTED}; margin-bottom: 3px; }
        .dul-exp-list { margin: 0; padding-left: 18px; list-style: disc; }
        .dul-exp-list > li { font-size: 13px; line-height: 1.5; color: ${MUTED}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function SideSection({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="flex flex-col" style={{ gap: 14 }}>
      <div className="flex items-center" style={{ gap: 10 }}>
        <span style={{ color: accent, fontFamily: OSWALD, fontWeight: 700, fontSize: 18 }}>»</span>
        <Tag
          className="uppercase m-0"
          style={{ fontFamily: OSWALD, fontSize: 19, fontWeight: 600, color: accent, letterSpacing: "0.04em" }}
        >
          {title}
        </Tag>
      </div>
      {children}
    </section>
  );
}

function MainSection({ title, accent, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <section className="flex flex-col" style={{ gap: 14 }}>
      <div className="flex items-center" style={{ gap: 10 }}>
        <span style={{ color: accent, fontFamily: OSWALD, fontWeight: 700, fontSize: 20 }}>»</span>
        <Tag
          className="uppercase m-0"
          style={{ fontFamily: OSWALD, fontSize: 21, fontWeight: 600, color: accent, letterSpacing: "0.04em" }}
        >
          {title}
        </Tag>
      </div>
      {children}
    </section>
  );
}

function Row({ icon, color, children }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span style={{ color }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
