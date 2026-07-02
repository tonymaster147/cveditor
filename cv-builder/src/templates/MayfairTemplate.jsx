import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import { makeBlocks } from "./blockHelpers";

// "Mayfair" — premium, executive CV. Playfair name over grey stone page,
// tracked-out orange role, small bulleted contact strip. Split body:
// 235px left (competencies list with divider rules, education, languages
// with left-bar, references) | 1px vertical rule | flex right (executive
// summary as an italic Playfair pull-quote, career history with Playfair
// job titles + orange company + border-left bullet paragraphs).

const PAGE_BG = "#f2f1ef";
const ORANGE = "#e8481c";
const RULE_DARK = "#3a3a3a";
const CELL_RULE = "#cfcac4";
const V_RULE = "#c5c0ba";
const BODY = "#333";
const SOFT = "#444";
const MUTED = "#9a9a9a";

const SERIF = "'Playfair Display', serif";
const SANS = "'Poppins', sans-serif";

export default function MayfairTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: PAGE_BG, fontFamily: SANS, color: BODY }}>
      {/* HEADER */}
      <div className="text-center" style={{ padding: "52px 40px 0" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF, fontSize: 60, fontWeight: 700, color: "#2b2b2b", lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          className="uppercase"
          style={{ fontSize: 19, fontWeight: 600, letterSpacing: 5, color: ORANGE, marginTop: 14 }}
        />
        <div
          className="flex justify-center items-center flex-wrap"
          style={{ gap: 10, marginTop: 30, fontSize: 11.5, letterSpacing: 0.5, color: "#777" }}
        >
          <span style={{ whiteSpace: "nowrap" }}>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </span>
          <span style={{ color: ORANGE }}>•</span>
          <span className="uppercase" style={{ whiteSpace: "nowrap" }}>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </span>
          <span style={{ color: ORANGE }}>•</span>
          <span className="uppercase" style={{ whiteSpace: "nowrap" }}>
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </span>
          <span style={{ color: ORANGE }}>•</span>
          <span className="uppercase" style={{ whiteSpace: "nowrap" }}>
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </span>
        </div>
        <div style={{ height: 2, background: RULE_DARK, marginTop: 22 }} />
      </div>

      {/* BODY */}
      <div className="flex box-border" style={{ padding: "34px 40px 48px" }}>
        {/* LEFT */}
        <div className="flex-none box-border" style={{ width: 235, paddingRight: 30 }}>
          <Title text="Competencies" />
          <div style={{ marginTop: 14 }}>
            {(data.skills || []).map((s, i) => (
              <div
                key={i}
                className="uppercase"
                style={{
                  fontSize: 12.5,
                  letterSpacing: 0.5,
                  color: SOFT,
                  padding: "9px 0",
                  borderBottom: i < data.skills.length - 1 ? `1px solid ${CELL_RULE}` : "none",
                }}
              >
                {s}
              </div>
            ))}
          </div>

          <Title text="Education" mt={30} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: 16 }}>
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                className="uppercase"
                style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 15, color: "#2b2b2b" }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13.5, color: "#555", marginTop: 3 }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 13, fontWeight: 600, color: ORANGE, marginTop: 4 }}
              />
            </div>
          ))}

          <Title text="Languages" mt={30} />
          <div className="flex flex-col" style={{ marginTop: 16, gap: 10 }}>
            {blocks.languages((l, i) => (
              <div
                key={i}
                className="flex justify-between"
                style={{ fontSize: 13.5 }}
              >
                <span style={{ borderLeft: `2px solid ${CELL_RULE}`, paddingLeft: 10, color: BODY }}>
                  <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                </span>
                {l.level && (
                  <span style={{ color: MUTED }}>
                    (<Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />)
                  </span>
                )}
              </div>
            ))}
          </div>

          <Title text="References" mt={30} />
          {blocks.references((r, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 16 : 14 }}>
              <Editable
                as="div"
                value={r.name}
                onChange={(v) => update(["references", i, "name"], v)}
                className="uppercase"
                style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 14.5, color: "#2b2b2b", letterSpacing: 0.5 }}
              />
              <Editable
                as="div"
                value={r.role}
                onChange={(v) => update(["references", i, "role"], v)}
                style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: "#555", marginTop: 3 }}
              />
              <div style={{ fontSize: 12.5, color: SOFT, marginTop: 4 }}>
                Phone:{" "}
                <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
              </div>
              <div style={{ fontSize: 12.5, color: SOFT, marginTop: 2 }}>
                Email:{" "}
                <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
              </div>
            </div>
          ))}
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="flex-none" style={{ width: 1, background: V_RULE }} />

        {/* RIGHT */}
        <div className="flex-1 box-border" style={{ paddingLeft: 30 }}>
          <Title text="Executive Summary" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 16,
              lineHeight: 1.75,
              color: "#4a4a4a",
              margin: "16px 0 0",
              textAlign: "justify",
            }}
          />

          <Title text="Career History" mt={32} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 20 : 26 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: "#2b2b2b" }}
                />
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  className="uppercase"
                  style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: MUTED }}
                />
              </div>
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                className="uppercase"
                style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: ORANGE, marginTop: 4 }}
              />
              {/* Each bullet renders as a border-left blockquote paragraph */}
              {(exp.bullets || []).map((b, bi) => (
                <p
                  key={bi}
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    color: SOFT,
                    margin: "12px 0 0",
                    borderLeft: `2px solid ${V_RULE}`,
                    paddingLeft: 14,
                    textAlign: "justify",
                  }}
                >
                  <Editable
                    as="span"
                    value={b}
                    onChange={(v) => {
                      const next = exp.bullets.slice();
                      next[bi] = v;
                      update(["experience", i, "bullets"], next);
                    }}
                    multiline
                  />
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Title({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="uppercase"
      style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, color: ORANGE, marginTop: mt || 0 }}
    >
      {text}
    </Tag>
  );
}
