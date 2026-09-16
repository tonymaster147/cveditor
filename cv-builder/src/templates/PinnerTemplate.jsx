import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Pinner" — decorative CV with a Playfair name in the top-right and a
// dusty-purple/dark-grey palette. Rounded-pill section headings each
// carry a small white circle icon on the left. Skills render as bars
// with black lozenges that slide across a cream track based on strength.

const PURPLE = "#6b6a9c";
const DARK = "#2c2c34";
const GREY = "#a6a6a6";
const CREAM_BAR = "#ece9df";
const INK = "#2b2b2b";
const SERIF = "'Playfair Display', serif";
const SERIF_BODY = "'PT Serif', serif";

// Skill "strength" — controls how far the black lozenge sits from the
// right edge of each bar. Lower = stronger.
const SKILL_OFFSETS = [8, 16, 6, 44, 74, 30, 50, 20];

export default function PinnerTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ position: "relative", background: "#fff", overflow: "hidden", fontFamily: SERIF_BODY, color: INK }}
    >
      {/* DECORATIVE SHAPES */}
      <div style={{ position: "absolute", left: 60, top: 0, width: 240, height: 296, background: GREY, borderRadius: "0 0 120px 120px" }} />
      <div
        style={{
          position: "absolute",
          top: -8,
          right: 102,
          width: 248,
          height: 90,
          background: PURPLE,
          clipPath: "polygon(18% 0,100% 0,82% 100%,0 100%)",
        }}
      />
      <div style={{ position: "absolute", top: -36, right: -28, width: 158, height: 158, borderRadius: "50%", background: "#101010" }} />
      <div style={{ position: "absolute", left: -38, bottom: -30, width: 188, height: 158, background: DARK, borderRadius: "0 62% 0 0" }} />
      <div style={{ position: "absolute", left: 52, bottom: -52, width: 172, height: 135, background: PURPLE, borderRadius: "62% 0 0 0" }} />
      <div style={{ position: "absolute", right: -30, bottom: -34, width: 196, height: 158, background: PURPLE, borderRadius: "64% 0 0 0" }} />
      <div style={{ position: "absolute", right: 30, bottom: -56, width: 172, height: 138, background: DARK, borderRadius: "70% 0 0 0" }} />

      {/* NAME/ROLE */}
      <div style={{ position: "absolute", top: 82, left: 410, width: 340, textAlign: "center" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, lineHeight: 0.9, color: INK }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, marginTop: 12, color: INK }}
        />
      </div>

      {/* CENTER VERTICAL RULE + DOTS */}
      <div style={{ position: "absolute", left: 395, top: 342, width: 2, height: 400, background: "#cfcfd6" }} />
      <div style={{ position: "absolute", left: 387, top: 432, width: 14, height: 14, borderRadius: "50%", background: PURPLE }} />
      <div style={{ position: "absolute", left: 387, top: 668, width: 14, height: 14, borderRadius: "50%", background: PURPLE }} />

      {/* BODY */}
      <div style={{ position: "absolute", top: 315, left: 0, right: 0, padding: "0 54px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "312px 1fr", gap: 46 }}>
          {/* LEFT */}
          <div>
            <PillHead text="Contact" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: "14px 10px",
                margin: "20px 0 0 16px",
                alignItems: "start",
                fontSize: 14,
              }}
            >
              <span style={{ fontSize: 16 }}>✆</span>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
              <span style={{ fontSize: 16 }}>✉</span>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
              <span style={{ fontSize: 16 }}>●</span>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </div>

            <PillHead text="Skills" mt={32} />
            <div style={{ marginTop: 20 }}>
              {(data.skills || []).slice(0, 8).map((s, i) => {
                const off = SKILL_OFFSETS[i % SKILL_OFFSETS.length];
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 14 }}>{s}</span>
                    <div style={{ position: "relative", height: 15, background: CREAM_BAR, borderRadius: 9 }}>
                      <div style={{ position: "absolute", right: off, top: 2, width: 26, height: 11, background: INK, borderRadius: 6 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <PillHead text="About Me" />
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ fontSize: 14, lineHeight: 1.5, margin: "18px 0 0" }}
            />

            <PillHead text="Education" mt={28} />
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginTop: 14 }}>
                <Editable
                  as="div"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  style={{ fontFamily: SERIF_BODY, fontWeight: 700, fontSize: 14 }}
                />
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  style={{ fontFamily: SERIF_BODY, fontWeight: 700, fontSize: 14 }}
                />
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontSize: 12, color: "#3a3a3a", marginTop: 3 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <PillHead text="Work Experience" width={240} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 18 }}>
            {blocks.experience((exp, i) => (
              <div key={i}>
                <Editable
                  as="div"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontFamily: SERIF_BODY, fontWeight: 700, fontSize: 14 }}
                />
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontFamily: SERIF_BODY, fontWeight: 700, fontSize: 14, marginTop: 8 }}
                />
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontSize: 12.5, color: "#3a3a3a", marginTop: 4 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="pin-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .pin-list { margin: 8px 0 0; padding-left: 20px; list-style: disc; }
        .pin-list > li { font-size: 12.5px; line-height: 1.5; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function PillHead({ text, mt, width }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div
      className="flex items-center"
      style={{
        position: "relative",
        background: PURPLE,
        borderRadius: 24,
        height: 44,
        paddingLeft: 56,
        marginTop: mt || 0,
        width: width,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 7,
          top: 7,
          width: 30,
          height: 30,
          border: "2.5px solid #fff",
          borderRadius: "50%",
        }}
      />
      <Tag className="m-0" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: "#fff" }}>
        {text}
      </Tag>
    </div>
  );
}
