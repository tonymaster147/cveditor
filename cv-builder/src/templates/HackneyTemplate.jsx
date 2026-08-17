import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Hackney" — editorial senior-copywriter CV. Bold Archivo name stacked
// on two lines, right-aligned contact block with tiny blue labels and
// short black rules. Career Highlights list has date labels rotated
// -45° down the left. Core Expertise has short blue skill-strength bars.
// Blue bar anchors the very bottom of the page.

const BLUE = "#2360c0";
const INK = "#111";
const BODY = "#333";
const SANS = "'Archivo', sans-serif";
const SERIF = "'PT Serif', serif";

// Synthetic skill-bar widths (max 160 to fit); staggered per index.
const SKILL_WIDTHS = [140, 120, 148, 108, 132, 116];

// Split "ELSIE MURRAY" so the name stacks on two lines.
function splitName(name) {
  const trimmed = (name || "").trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return [trimmed, ""];
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
}

export default function HackneyTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);
  const [first, rest] = splitName(data.name);

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: SERIF, color: INK, position: "relative", overflow: "hidden" }}>
      <div style={{ padding: "48px 42px 46px" }}>
        {/* HEADER */}
        <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", columnGap: 20, alignItems: "start" }}>
          <div>
            <div className="uppercase" style={{ fontFamily: SANS, fontWeight: 900, fontSize: 34, lineHeight: 0.98, letterSpacing: -0.5 }}>
              <Editable as="span" value={first} onChange={(v) => update(["name"], `${v} ${rest}`.trim())} />
              <br />
              <Editable as="span" value={rest} onChange={(v) => update(["name"], `${first} ${v}`.trim())} />
            </div>
            <Editable
              as="div"
              value={data.role}
              onChange={(v) => update(["role"], v)}
              style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, marginTop: 12 }}
            />
          </div>

          <div style={{ paddingTop: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontFamily: SANS }}>
              <ContactCell label="Phone" ruleWidth={36}>
                <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
              </ContactCell>
              <ContactCell label="Email" ruleWidth={64}>
                <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
              </ContactCell>
            </div>
            <div style={{ marginTop: 12, fontFamily: SANS }}>
              <ContactCell label="Portfolio" ruleWidth={96}>
                <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
              </ContactCell>
            </div>
            <div style={{ marginTop: 18 }}>
              <Editable
                as="span"
                value={data.location}
                onChange={(v) => update(["location"], v)}
                style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, color: BLUE, whiteSpace: "nowrap" }}
              />
            </div>
            <div style={{ height: 1.5, background: INK, marginTop: 6 }} />
          </div>
        </div>

        {/* SUMMARY */}
        <div style={{ marginTop: 32 }}>
          <RuleTitle text="Professional Summary" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 13, lineHeight: 1.55, margin: "10px 0 0" }}
          />
        </div>

        {/* CAREER HIGHLIGHTS with rotated dates */}
        <div style={{ marginTop: 30 }}>
          <RuleTitle text="Career Highlights" />
          <div style={{ marginTop: 18 }}>
            {blocks.experience((exp, i) => (
              <div
                key={i}
                className="flex"
                style={{ gap: 6, marginBottom: 20, alignItems: "flex-start" }}
              >
                <div
                  className="flex-none flex items-center justify-center"
                  style={{ width: 90 }}
                >
                  <Editable
                    as="span"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    style={{
                      fontFamily: SANS,
                      transform: "rotate(-45deg)",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                      fontSize: 13,
                      marginTop: 24,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Editable
                    as="div"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14 }}
                  />
                  <Editable
                    as="div"
                    value={exp.company}
                    onChange={(v) => update(["experience", i, "company"], v)}
                    style={{ fontSize: 12.5, color: BODY, marginTop: 3, fontStyle: "italic" }}
                  />
                  <EditableList
                    items={exp.bullets}
                    onChange={(v) => update(["experience", i, "bullets"], v)}
                    className="hac-list"
                    bullet="•"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION + CORE EXPERTISE + LANGUAGES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 32, marginTop: 32 }}>
          <div>
            <RuleTitle text="Education" />
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginTop: 14 }}>
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13.5 }}
                />
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  style={{ fontSize: 13, color: BODY, marginTop: 3, lineHeight: 1.5 }}
                />
              </div>
            ))}
          </div>

          <div>
            <RuleTitle text="Core Expertise" />
            <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 700, fontSize: 13.5 }}>
              {(data.skills || []).slice(0, 6).map((s, i) => {
                const w = SKILL_WIDTHS[i % SKILL_WIDTHS.length];
                return (
                  <div key={i} className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <span>{s}</span>
                    <span className="flex items-center" style={{ gap: 4 }}>
                      <span style={{ width: w, maxWidth: 160, height: 5, borderRadius: 3, background: BLUE }} />
                      <span style={{ width: 12, height: 1.5, background: INK }} />
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 22 }}>
              <RuleTitle text="Languages" />
            </div>
            <div style={{ marginTop: 12, fontFamily: SANS, fontSize: 13 }}>
              {blocks.languages((l, i) => (
                <div key={i} className="flex" style={{ gap: 20, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, minWidth: 110 }}>
                    <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                  </span>
                  <span style={{ fontFamily: SERIF }}>
                    {l.level ? (
                      <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
                    ) : (
                      "Fluent"
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BLUE BAR */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 36, background: BLUE }} />

      <style>{`
        .hac-list { margin: 6px 0 0; padding-left: 20px; list-style: disc; font-family: ${SERIF}; }
        .hac-list > li { font-size: 12.5px; line-height: 1.5; color: ${BODY}; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function RuleTitle({ text }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <Tag
        className="m-0"
        style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: BLUE }}
      >
        {text}
      </Tag>
      <span style={{ width: 36, height: 2, background: INK }} />
    </div>
  );
}

function ContactCell({ label, ruleWidth, children }) {
  return (
    <div>
      <div className="flex items-center" style={{ gap: 6 }}>
        <span style={{ color: BLUE, fontWeight: 700, fontSize: 12.5 }}>{label}</span>
        <span className="flex-1" style={{ height: 1.5, background: INK, maxWidth: ruleWidth }} />
      </div>
      <div style={{ fontSize: 12.5, marginTop: 3 }}>{children}</div>
    </div>
  );
}
