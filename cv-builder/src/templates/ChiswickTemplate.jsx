import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Chiswick" — minimal monochrome CV. Off-white page. Name split into a
// thin ELSIE + bold MURRAY with wide letter-spacing, sitting next to a
// vertical black rule. Role in a heavy-bordered horizontal box, contact
// icons to the right. Body has another vertical rule with About Me,
// Work Experience, References, and a right column with Skills, Education,
// Language.

const DARK = "#222";
const INK = "#111";
const BODY = "#333";
const MUTED = "#8a8a8a";
const PAGE = "#fdfdfb";
const FONT = "'Poppins', sans-serif";

// Split "ELSIE MURRAY" — first name thin, surname bold.
function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function ChiswickTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);

  return (
    <div
      className="cv-page"
      style={{ background: PAGE, fontFamily: FONT, color: INK, padding: "42px 44px 44px", boxSizing: "border-box" }}
    >
      {/* NAME — vertical rule + stacked ELSIE / MURRAY */}
      <div className="flex" style={{ gap: 16 }}>
        <div className="flex-none" style={{ width: 2, background: DARK, margin: "6px 0" }} />
        <div>
          <Editable
            as="div"
            value={first}
            onChange={(v) => update(["name"], `${v} ${rest}`.trim())}
            className="uppercase"
            style={{ fontWeight: 400, fontSize: 32, letterSpacing: 10, color: DARK }}
          />
          <Editable
            as="div"
            value={rest}
            onChange={(v) => update(["name"], `${first} ${v}`.trim())}
            className="uppercase"
            style={{ fontWeight: 800, fontSize: 46, letterSpacing: 10, color: INK, lineHeight: 1.05 }}
          />
        </div>
      </div>

      {/* ROLE BOX + CONTACT ICONS */}
      <div className="flex" style={{ alignItems: "flex-start", gap: 26, marginTop: 18 }}>
        <div
          className="flex-none text-center"
          style={{ width: 460, border: `2px solid ${DARK}`, padding: "14px 0" }}
        >
          <Editable
            as="span"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="uppercase"
            style={{ fontWeight: 700, fontSize: 22, letterSpacing: 10, color: DARK }}
          />
        </div>
        <div className="flex-1" style={{ fontSize: 13, color: BODY, paddingTop: 2 }}>
          <ContactRow icon="✉">
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </ContactRow>
          <ContactRow icon="✆">
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </ContactRow>
          <ContactRow icon="●">
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </ContactRow>
          <ContactRow icon="🌐">
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </ContactRow>
        </div>
      </div>

      {/* BODY — vertical rule then content */}
      <div className="flex" style={{ gap: 16, marginTop: 32 }}>
        <div className="flex-none" style={{ width: 2, background: DARK }} />
        <div className="flex-1">
          <Title text="About Me" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13, lineHeight: 1.7, color: BODY, marginTop: 14 }}
          />

          {/* Two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 40, marginTop: 40 }}>
            {/* LEFT — Work Experience + References */}
            <div>
              <Title text="Work Experience" size={22} />
              <div style={{ marginTop: 18 }}>
                {blocks.experience((exp, i) => (
                  <div key={i} style={{ marginTop: i === 0 ? 0 : 22 }}>
                    <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>
                      <Editable as="span" value={exp.date} onChange={(v) => update(["experience", i, "date"], v)} />
                      <br />
                      <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                    </div>
                    <Editable
                      as="div"
                      value={exp.title}
                      onChange={(v) => update(["experience", i, "title"], v)}
                      style={{ fontSize: 16, color: INK, marginTop: 6 }}
                    />
                    <EditableList
                      items={exp.bullets}
                      onChange={(v) => update(["experience", i, "bullets"], v)}
                      className="chi-list"
                      bullet="•"
                    />
                  </div>
                ))}
              </div>

              <Title text="References" size={22} mt={34} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 18 }}>
                {blocks.references((r, i) => (
                  <div key={i}>
                    <Editable
                      as="div"
                      value={r.name}
                      onChange={(v) => update(["references", i, "name"], v)}
                      style={{ fontWeight: 700, fontSize: 15, color: INK }}
                    />
                    <Editable
                      as="div"
                      value={r.role}
                      onChange={(v) => update(["references", i, "role"], v)}
                      style={{ fontSize: 13, color: BODY, marginTop: 2 }}
                    />
                    <div style={{ fontSize: 11.5, color: BODY, marginTop: 8, lineHeight: 1.7 }}>
                      <b>Phone:</b>{" "}
                      <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
                      <br />
                      <b>Email :</b>{" "}
                      <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Skills + Education + Language */}
            <div>
              <Title text="Skills" size={22} />
              <EditableList
                items={data.skills}
                onChange={(v) => update(["skills"], v)}
                className="chi-skill-list"
                bullet="•"
              />

              <Title text="Education" size={22} mt={30} />
              <div style={{ marginTop: 14 }}>
                {blocks.education((ed, i) => (
                  <div key={i} style={{ marginTop: i === 0 ? 0 : 20 }}>
                    <Editable
                      as="div"
                      value={ed.degree}
                      onChange={(v) => update(["education", i, "degree"], v)}
                      style={{ fontSize: 16, color: INK }}
                    />
                    <Editable
                      as="div"
                      value={ed.school}
                      onChange={(v) => update(["education", i, "school"], v)}
                      style={{ fontWeight: 700, fontSize: 13, color: INK, marginTop: 4 }}
                    />
                    <Editable
                      as="div"
                      value={ed.date}
                      onChange={(v) => update(["education", i, "date"], v)}
                      style={{ fontSize: 12.5, color: BODY, marginTop: 2 }}
                    />
                  </div>
                ))}
              </div>

              <Title text="Language" size={22} mt={30} />
              <div className="flex flex-col" style={{ marginTop: 14, gap: 12, fontSize: 15, color: INK }}>
                {blocks.languages((l, i) => (
                  <div key={i}>
                    <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .chi-list { margin: 8px 0 0 18px; padding-left: 0; list-style: disc; }
        .chi-list > li { font-size: 12.5px; line-height: 1.6; color: ${BODY}; margin-bottom: 3px; }
        .chi-skill-list { margin: 14px 0 0 18px; padding-left: 0; list-style: disc; }
        .chi-skill-list > li { font-size: 14px; line-height: 1.4; color: ${BODY}; margin-bottom: 10px; }
      `}</style>
    </div>
  );
}

function Title({ text, size, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag style={{ fontWeight: 700, fontSize: size || 20, color: DARK, marginTop: mt || 0 }}>
      {text}
    </Tag>
  );
}

function ContactRow({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 10, marginBottom: 10 }}>
      <span style={{ color: DARK, fontSize: 14 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
