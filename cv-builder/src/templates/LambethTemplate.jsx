import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Lambeth" — cream Montserrat/Poppins CV. Cream (#e7e4dc) header band
// with centered tracked name + role. Body: Profile row (person icon +
// title + summary), then 2-col: narrow left sidebar (dark-circle icon
// contacts + cream pill-heading Education / Expertise / Language) +
// wide right (Work Experience with narrow year columns + timeline rail).

const CREAM = "#e7e4dc";
const RAIL = "#cdc8bd";
const INK = "#2d2d2d";
const BODY = "#555";
const MUTED = "#777";
const SANS = "'Poppins', sans-serif";
const HEAD = "'Montserrat', sans-serif";

export default function LambethTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: SANS, color: INK, overflow: "hidden" }}>
      {/* HEADER BAND */}
      <div className="flex flex-col items-center justify-center" style={{ background: CREAM, height: 148 }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: INK, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontWeight: 400, fontSize: 16, letterSpacing: 5, color: "#565656", marginTop: 12 }}
        />
      </div>

      {/* PROFILE */}
      <div style={{ padding: "20px 36px 0" }}>
        <IconTitle icon="◐" text="Profile" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontWeight: 300, fontSize: 12, lineHeight: 1.7, color: MUTED, textAlign: "justify", margin: "10px 0 0" }}
        />
      </div>

      {/* BODY 2-COL */}
      <div className="flex" style={{ padding: "16px 36px 0", gap: 30 }}>
        {/* LEFT sidebar */}
        <div className="flex-none" style={{ width: 210 }}>
          <div className="flex flex-col" style={{ gap: 10, marginBottom: 18 }}>
            <IconContact><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconContact>
            <IconContact><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconContact>
            <IconContact><Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} /></IconContact>
            <IconContact><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconContact>
          </div>

          <PillTitle text="Education" />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15, color: INK }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 600, fontSize: 12, color: "#333", marginTop: 2 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontWeight: 300, fontSize: 12, color: MUTED }}
              />
            </div>
          ))}

          <PillTitle text="Expertise" mt={4} />
          <div className="flex flex-col" style={{ gap: 8, marginBottom: 14, fontWeight: 400, fontSize: 13, color: INK }}>
            {(data.skills || []).map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>

          <PillTitle text="Language" mt={4} />
          <div className="flex flex-col" style={{ gap: 8, fontWeight: 400, fontSize: 13, color: INK }}>
            {blocks.languages((l, i) => (
              <div key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT main */}
        <div className="flex-1">
          <IconTitle icon="▤" text="Work Experience" />
          <div style={{ marginTop: 10 }}>
            {blocks.experience((exp, i) => (
              <div key={i} className="flex" style={{ marginBottom: 12 }}>
                <div
                  className="flex-none"
                  style={{ width: 54, fontFamily: HEAD, fontWeight: 700, fontSize: 12, letterSpacing: 1, color: INK, lineHeight: 1.55 }}
                >
                  <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                </div>
                <div style={{ borderLeft: `1.5px solid ${RAIL}`, paddingLeft: 18, marginLeft: 6 }}>
                  <Editable
                    as="div"
                    value={exp.company}
                    onChange={(v) => update(["experience", i, "company"], v)}
                    style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15, color: INK }}
                  />
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontWeight: 400, fontSize: 12, color: BODY, marginTop: 3 }}
                  />
                  <EditableList
                    items={exp.bullets}
                    onChange={(v) => update(["experience", i, "bullets"], v)}
                    className="lam-list"
                    bullet="•"
                  />
                </div>
              </div>
            ))}
          </div>

          <IconTitle icon="✎" text="References" mt={10} />
          <div className="flex" style={{ gap: 28, marginTop: 10 }}>
            {blocks.references((r, i) => (
              <div key={i} className="flex-1">
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 15, color: INK }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontWeight: 400, fontSize: 12, color: "#444", marginTop: 2 }}
                />
                <div style={{ marginTop: 8, fontSize: 10, color: "#444", lineHeight: 1.9 }}>
                  <span style={{ fontWeight: 700 }}>Phone:</span>{" "}
                  <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                  <br />
                  <span style={{ fontWeight: 700 }}>Email :</span>{" "}
                  <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .lam-list { margin: 5px 0 0; padding-left: 18px; list-style: disc; }
        .lam-list > li { font-weight: 300; font-size: 11.5px; color: ${BODY}; line-height: 1.5; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function IconTitle({ icon, text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 10, marginTop: mt || 0 }}>
      <span style={{ color: INK, fontSize: 20 }}>{icon || "●"}</span>
      <Tag
        className="m-0"
        style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 20, color: INK }}
      >
        {text}
      </Tag>
    </div>
  );
}

function PillTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ background: CREAM, padding: "6px 10px", marginTop: mt || 0, marginBottom: 12 }}>
      <Tag
        className="m-0"
        style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 18, color: INK }}
      >
        {text}
      </Tag>
    </div>
  );
}

function IconContact({ children }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <span
        className="flex items-center justify-center flex-none"
        style={{ width: 30, height: 30, borderRadius: "50%", background: INK, color: "#fff", fontSize: 12 }}
      >
        ●
      </span>
      <span style={{ fontSize: 12, color: "#333" }}>{children}</span>
    </div>
  );
}
