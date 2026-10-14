import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import { makeBlocks } from "./blockHelpers";

// "Bromley" — Playfair Display name over PT Serif body. Dusty indigo
// (#5f5c86) pill section headings each with a white outlined circle.
// Decorative shapes: grey half-dome top-left, skewed indigo ribbon
// top-middle, dark circle top-right, organic blobs across the bottom.
// Center vertical timeline rail with two indigo dots between columns.
// Skills render as cream bars with dark lozenges floating from the right.

const INDIGO = "#5f5c86";
const DARK = "#2b2b33";
const GREY = "#9e9e9e";
const CREAM = "#efe9df";
const INK = "#222";
const SERIF = "'Playfair Display', serif";
const BODY = "'PT Serif', serif";

const SKILL_OFFSETS = [24, 21, 26, 30, 19, 34, 22, 28];

export default function BromleyTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ position: "relative", background: "#fff", overflow: "hidden", fontFamily: BODY, color: INK }}
    >
      {/* Decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 75,
          width: 252,
          height: 388,
          background: GREY,
          borderRadius: "0 0 126px 126px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 468,
          width: 205,
          height: 70,
          background: INDIGO,
          transform: "skewX(-32deg)",
          transformOrigin: "top left",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -34,
          right: -26,
          width: 156,
          height: 156,
          borderRadius: "50%",
          background: "#111",
        }}
      />
      {/* Bottom blobs */}
      <div
        style={{
          position: "absolute",
          bottom: -32,
          left: -56,
          width: 140,
          height: 140,
          background: DARK,
          borderRadius: "62% 38% 55% 45%/58% 42% 58% 42%",
          transform: "rotate(12deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -70,
          left: 22,
          width: 140,
          height: 140,
          background: INDIGO,
          borderRadius: "58% 42% 48% 52%/52% 48% 52% 48%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: -40,
          width: 160,
          height: 140,
          background: DARK,
          borderRadius: "55% 45% 50% 50%/60% 50% 50% 40%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: 54,
          width: 130,
          height: 120,
          background: INDIGO,
          borderRadius: "52% 48% 55% 45%/55% 45% 55% 45%",
          transform: "rotate(-10deg)",
        }}
      />

      {/* NAME */}
      <div style={{ position: "absolute", top: 66, left: 400, right: 36, textAlign: "center" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 48, lineHeight: 1, color: "#333" }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 26, color: "#333", marginTop: 14 }}
        />
      </div>

      {/* Middle timeline */}
      <div style={{ position: "absolute", left: 397, top: 470, width: 2, height: 320, background: "#9b99b5" }} />
      <div style={{ position: "absolute", left: 390, top: 540, width: 16, height: 16, borderRadius: "50%", background: INDIGO }} />
      <div style={{ position: "absolute", left: 390, top: 690, width: 16, height: 16, borderRadius: "50%", background: INDIGO }} />

      {/* LEFT COLUMN */}
      <div
        style={{
          position: "absolute",
          top: 418,
          left: 75,
          width: 300,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Pill text="Contact" width={260} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingLeft: 18, marginTop: -8 }}>
          <IconLine icon="✆">
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </IconLine>
          <IconLine icon="✉">
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </IconLine>
          <IconLine icon="◉">
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </IconLine>
        </div>

        <Pill text="Skills" width={260} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: -8 }}>
          {(data.skills || []).slice(0, 7).map((s, i) => {
            const off = SKILL_OFFSETS[i % SKILL_OFFSETS.length];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 138, fontSize: 15, color: INK }}>{s}</span>
                <div style={{ flex: 1, height: 15, background: CREAM, borderRadius: 8, position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: `${off}%`,
                      background: "#2b2b2b",
                      borderRadius: 8,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Pill text="Work Experience" width={280} />
        {blocks.experience((exp, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: i === 0 ? -8 : 4 }}>
            <Editable
              as="div"
              value={exp.date}
              onChange={(v) => update(["experience", i, "date"], v)}
              style={{ fontWeight: 700, fontSize: 16, color: INK }}
            />
            <Editable
              as="div"
              value={exp.company}
              onChange={(v) => update(["experience", i, "company"], v)}
              style={{ fontWeight: 700, fontSize: 16, color: INK }}
            />
            <Editable
              as="p"
              value={exp.title}
              onChange={(v) => update(["experience", i, "title"], v)}
              multiline
              style={{ fontSize: 14, lineHeight: 1.5, color: INK }}
            />
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN */}
      <div
        style={{
          position: "absolute",
          top: 418,
          left: 420,
          width: 300,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Pill text="About Me" width={260} />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontSize: 14, lineHeight: 1.5, color: INK, marginTop: -8 }}
        />

        <Pill text="Education" width={260} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: -8 }}>
          {blocks.education((ed, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontWeight: 700, fontSize: 16, color: INK }}
              />
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 700, fontSize: 16, color: INK }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 13.5, color: "#333" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({ text, width }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: INDIGO,
        borderRadius: 30,
        height: 48,
        padding: "0 24px",
        width: width,
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          border: "2px solid #fff",
          borderRadius: "50%",
          flex: "0 0 auto",
        }}
      />
      <Tag className="m-0" style={{ fontWeight: 700, fontSize: 21, color: "#fff" }}>
        {text}
      </Tag>
    </div>
  );
}

function IconLine({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 20, color: "#111", width: 24, textAlign: "center" }}>{icon}</span>
      <span style={{ fontSize: 15, color: INK }}>{children}</span>
    </div>
  );
}
