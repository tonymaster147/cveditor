import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Kensington" — sophisticated senior CV. Wide-spaced light name (300
// weight, 16px letter-spacing) with a matching muted-purple role. Left
// column is a full-height dusty-purple (#6b6f9e) block with white text
// for Contact / Skills / Education / Language. Right column has a purple-
// bordered summary card and light-weight EXPERIENCE items.

const PURPLE = "#6b6f9e";
const HEADING = "#2b2b2b";
const BODY = "#444";
const SOFT = "#555";
const SIDEBAR_MUTED = "#e2e3f0";
const FONT = "'Poppins', sans-serif";

export default function KensingtonTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: "#333" }}>
      {/* HEADER */}
      <div className="text-center" style={{ padding: "60px 40px 44px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontSize: 58, fontWeight: 300, letterSpacing: 16, color: HEADING, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ fontSize: 24, fontWeight: 400, letterSpacing: 12, color: PURPLE, marginTop: 16 }}
        />
      </div>

      {/* BODY */}
      <div className="flex flex-1">
        {/* PURPLE SIDEBAR */}
        <aside
          className="flex-none box-border"
          style={{ width: 320, background: PURPLE, color: "#fff", padding: "40px 34px 50px" }}
        >
          <div className="flex flex-col" style={{ gap: 18, fontSize: 14 }}>
            <SideRow icon="✆">
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </SideRow>
            <SideRow icon="✉">
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </SideRow>
            <SideRow icon="●">
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </SideRow>
            <SideRow icon="🌐">
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </SideRow>
          </div>

          <SidebarTitle title="Skills" mt={34} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="ken-list"
            bullet="•"
          />

          <SidebarTitle title="Education" mt={32} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: 16 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontSize: 16, color: "#fff" }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 13.5, color: SIDEBAR_MUTED, marginTop: 4 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13.5, color: SIDEBAR_MUTED, marginTop: 2 }}
              />
            </div>
          ))}

          <SidebarTitle title="Language" mt={32} />
          <div className="flex flex-col" style={{ marginTop: 14, gap: 8, fontSize: 14 }}>
            {blocks.languages((l, i) => (
              <div key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </div>

          <style>{`
            .ken-list { margin: 16px 0 0; padding-left: 20px; list-style: disc; }
            .ken-list > li { font-size: 14px; line-height: 1.95; }
          `}</style>
        </aside>

        {/* RIGHT MAIN */}
        <div className="flex-1 box-border" style={{ padding: "40px 40px 50px" }}>
          {/* Summary in a purple-bordered card that runs off the right edge */}
          <div
            style={{
              border: `1px solid ${PURPLE}`,
              borderRight: "none",
              padding: "6px 20px 6px 0",
              marginRight: -40,
              paddingRight: 40,
            }}
          >
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ fontSize: 15, lineHeight: 1.7, color: BODY, margin: 0, textAlign: "justify" }}
            />
          </div>

          <MainTitle title="Experience" mt={34} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 16 : 22 }}>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                className="uppercase"
                style={{ fontSize: 18, color: HEADING }}
              />
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontSize: 14, color: SOFT, marginTop: 4 }}
              />
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 14, color: SOFT, marginTop: 2 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="ken-exp-list"
                bullet="•"
              />
            </div>
          ))}

          <style>{`
            .ken-exp-list { margin: 10px 0 0; padding-left: 22px; list-style: disc; }
            .ken-exp-list > li { font-size: 14px; line-height: 1.6; color: ${BODY}; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function SidebarTitle({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontSize: 26, fontWeight: 300, letterSpacing: 6, color: "#fff", marginTop: mt }}
    >
      {title}
    </Tag>
  );
}

function MainTitle({ title, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontSize: 28, fontWeight: 600, letterSpacing: 8, color: PURPLE, marginTop: mt }}
    >
      {title}
    </Tag>
  );
}

function SideRow({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 16 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
