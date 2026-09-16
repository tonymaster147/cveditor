import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Croydon" — Lato CV. Thin grey vertical stripe on the right edge and
// a small blue triangle in the bottom-right corner. Left sidebar is a
// grey rounded card outlined by a blue border box (offset a few pixels
// for a layered effect) with CONTACT / PERSONAL DETAILS / SKILLS /
// LANGUAGES. Right main column: name in navy, PROFESSIONAL SUMMARY,
// EDUCATION, INTERNSHIPS, PROJECTS, CERTIFICATIONS, ACHIEVEMENTS.

const NAVY = "#12468f";
const NAVY_SOFT = "#2e6fc4";
const CARD = "#d9d9d9";
const STRIPE = "#c9c9c9";
const INK = "#222";
const FONT = "'Lato', sans-serif";

export default function CroydonTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [firstLang, ...restLangs] = data.languages || [];

  return (
    <div
      className="cv-page"
      style={{ position: "relative", background: "#fff", fontFamily: FONT, color: INK, overflow: "hidden", fontSize: 12 }}
    >
      {/* Right vertical stripe */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 12, background: STRIPE }} />
      {/* Bottom-right blue triangle */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 96,
          height: 82,
          background: NAVY,
          clipPath: "polygon(100% 0,100% 100%,0 100%)",
        }}
      />

      {/* Sidebar outline (blue border offset behind the grey card) */}
      <div style={{ position: "absolute", left: 44, top: 188, width: 240, height: 880, border: `2.5px solid ${NAVY}`, borderRadius: 14 }} />
      {/* Sidebar grey card */}
      <div style={{ position: "absolute", left: 68, top: 212, width: 240, height: 880, background: CARD, borderRadius: 14 }} />
      {/* Small top-left tag on card */}
      <div style={{ position: "absolute", left: 68, top: 212, width: 110, height: 10, background: NAVY, borderRadius: "14px 0 0 0" }} />

      {/* Name / Role */}
      <div style={{ position: "absolute", top: 80, left: 310, right: 44 }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontWeight: 900, fontSize: 34, letterSpacing: 2, color: NAVY, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ fontWeight: 900, fontSize: 17, letterSpacing: 4, color: NAVY_SOFT, marginTop: 4 }}
        />
      </div>

      {/* Sidebar content */}
      <div style={{ position: "absolute", top: 230, left: 84, width: 208, fontSize: 12 }}>
        <BlueTitle text="Contact" />
        <div className="flex flex-col" style={{ gap: 10, marginTop: 12 }}>
          <IconRow icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconRow>
          <IconRow icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconRow>
          <IconRow icon="🌐"><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></IconRow>
        </div>

        <BlueTitle text="Personal Details" mt={20} />
        <div style={{ marginTop: 12, lineHeight: 1.5 }}>
          <div>
            <b>Nationality:</b>{" "}
            {firstLang ? <Editable as="span" value={firstLang.name} onChange={(v) => update(["languages", 0, "name"], v)} /> : "—"}
          </div>
          <div>
            <b>Address:</b>{" "}
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </div>
        </div>

        <BlueTitle text="Skills" mt={20} />
        <ul style={{ margin: "10px 0 0", paddingLeft: 20, lineHeight: 1.5 }}>
          {(data.skills || []).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <BlueTitle text="Languages" mt={20} />
        <ul style={{ margin: "10px 0 0", paddingLeft: 20, lineHeight: 1.5 }}>
          {(restLangs.length ? restLangs : [firstLang].filter(Boolean)).map((l, i) => (
            <li key={i}>
              <Editable
                as="span"
                value={l.name}
                onChange={(v) => update(["languages", restLangs.length ? i + 1 : i, "name"], v)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div style={{ position: "absolute", top: 190, left: 320, right: 52, fontSize: 12 }}>
        <RuleTitle text="Professional Summary" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ margin: "10px 0 18px", lineHeight: 1.5 }}
        />

        <RuleTitle text="Education" />
        <div style={{ marginTop: 10 }}>
          {blocks.education((ed, i) => (
            <div key={i} className="flex justify-between items-baseline" style={{ marginTop: i === 0 ? 0 : 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>
                  <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                </div>
                <div style={{ fontStyle: "italic" }}>
                  <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                </div>
              </div>
              <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
            </div>
          ))}
        </div>

        <RuleTitle text="Internships & Experience" mt={16} />
        {blocks.experience((exp, i) => (
          <div key={i} style={{ marginTop: 12 }}>
            <div className="flex justify-between items-baseline">
              <div>
                <span style={{ fontWeight: 700 }}>
                  <Editable as="span" value={exp.title} onChange={(v) => update(["experience", i, "title"], v)} />
                </span>
                {"   "}
                <span style={{ fontStyle: "italic" }}>
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                </span>
              </div>
              <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
            </div>
            <EditableList
              items={exp.bullets}
              onChange={(v) => update(["experience", i, "bullets"], v)}
              className="cro-list"
              bullet="•"
            />
          </div>
        ))}

        <RuleTitle text="References" mt={16} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 10 }}>
          {blocks.references((r, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700 }}>
                <Editable as="span" value={r.name} onChange={(v) => update(["references", i, "name"], v)} />
              </div>
              <div style={{ fontStyle: "italic" }}>
                <Editable as="span" value={r.role} onChange={(v) => update(["references", i, "role"], v)} />
              </div>
              <div style={{ marginTop: 4, fontSize: 11 }}>
                <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                <br />
                <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cro-list { margin: 6px 0 0; padding-left: 18px; list-style: disc; }
        .cro-list > li { font-size: 11.5px; line-height: 1.55; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function BlueTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: 1,
        color: NAVY,
        borderBottom: `2px solid ${NAVY}`,
        paddingBottom: 5,
        marginTop: mt || 0,
      }}
    >
      {text}
    </Tag>
  );
}

function RuleTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase m-0"
      style={{
        fontWeight: 900,
        fontSize: 15,
        letterSpacing: 1,
        borderBottom: `2px solid ${NAVY}`,
        paddingBottom: 5,
        marginTop: mt || 0,
      }}
    >
      {text}
    </Tag>
  );
}

function IconRow({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span style={{ color: NAVY, fontSize: 13 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
