import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Peckham" — creative CV that looks like a browser/app window. Grey-
// lilac page, rounded-border header card with a row of red mac-style
// dots in the corner. Playfair Display serif name, tracked-out role,
// red divider. Section titles are all bordered rounded-pill capsules.

const PAGE = "#f1eff1";
const INK = "#2a2a2a";
const RED = "#d5104f";
const SERIF = "'Playfair Display', serif";
const SANS = "'Mulish', sans-serif";

export default function PeckhamTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: PAGE, fontFamily: SANS, color: INK, padding: "26px 30px" }}>
      {/* HEADER CARD */}
      <div style={{ border: `1.5px solid ${INK}`, borderRadius: 20, padding: "20px 32px 26px", position: "relative" }}>
        <div className="flex" style={{ gap: 8, position: "absolute", top: 18, left: 22 }}>
          <Dot /><Dot /><Dot />
        </div>
        <div className="text-center">
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: "#222", lineHeight: 1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="uppercase"
            style={{ fontWeight: 400, fontSize: 20, letterSpacing: 4, color: INK, marginTop: 8 }}
          />
        </div>
        <div style={{ height: 1.5, background: INK, margin: "20px 0 16px", width: "72%", marginLeft: "auto" }} />
        <div className="flex flex-wrap" style={{ justifyContent: "center", gap: 48, fontStyle: "italic", fontSize: 14 }}>
          <span className="flex items-center" style={{ gap: 8 }}>
            <span style={{ color: RED, fontSize: 14 }}>✆</span>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </span>
          <span className="flex items-center" style={{ gap: 8 }}>
            <span style={{ color: RED, fontSize: 14 }}>✉</span>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </span>
        </div>
      </div>

      {/* PROFILE */}
      <div style={{ marginTop: 24 }}>
        <PillTitle text="My Personal Profile:" />
        <Editable
          as="p"
          value={data.summary}
          onChange={(v) => update(["summary"], v)}
          multiline
          style={{ fontSize: 14, lineHeight: 1.55, margin: "12px 0 0" }}
        />
      </div>

      {/* TWO COLUMNS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28, marginTop: 22 }}>
        {/* LEFT */}
        <div>
          <PillTitle text="Copy Writing Experience" />
          <div style={{ fontSize: 14, marginTop: 12 }}>
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontWeight: 700 }}
                />
                <Editable
                  as="div"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontStyle: "italic" }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="pec-list"
                  bullet="•"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <PillTitle text="Skills" />
          <ul className="pec-skill-list">
            {(data.skills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <PillTitle text="Reference" mt={20} />
          <div style={{ fontSize: 14, marginTop: 12 }}>
            {blocks.references((r, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <Editable as="div" value={r.name} onChange={(v) => update(["references", i, "name"], v)} style={{ fontWeight: 700 }} />
                <Editable as="div" value={r.role} onChange={(v) => update(["references", i, "role"], v)} style={{ fontStyle: "italic" }} />
                <ul className="pec-ref-list">
                  <li><Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} /></li>
                  <li><Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} /></li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADDITIONAL INFO CARD */}
      <div style={{ border: `1.5px solid ${INK}`, borderRadius: 20, padding: "16px 24px", marginTop: 22 }}>
        <div
          className="uppercase"
          style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 17, letterSpacing: 1, marginBottom: 5 }}
        >
          Additional Information
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>Portfolio link with my best copywriting samples.</div>
        <div className="flex items-center" style={{ gap: 8, fontStyle: "italic", fontSize: 14, marginTop: 4 }}>
          <span style={{ color: RED, fontSize: 14 }}>🌐</span>
          <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
        </div>
      </div>

      {/* BOTTOM RED DOTS */}
      <div className="flex" style={{ gap: 8, justifyContent: "flex-end", marginTop: 16, paddingRight: 6 }}>
        <Dot /><Dot /><Dot />
      </div>

      <style>{`
        .pec-list { margin: 6px 0 0; padding-left: 20px; list-style: disc; }
        .pec-list > li { font-size: 13.5px; line-height: 1.45; margin-bottom: 4px; }
        .pec-skill-list { margin: 12px 0 0; padding-left: 20px; list-style: disc; }
        .pec-skill-list > li { font-size: 13.5px; line-height: 1.45; margin-bottom: 4px; }
        .pec-ref-list { margin: 6px 0 0; padding-left: 20px; list-style: disc; }
        .pec-ref-list > li { font-size: 13px; line-height: 1.5; margin-bottom: 3px; }
      `}</style>
    </div>
  );
}

function PillTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div className="inline-flex" style={{ marginTop: mt || 0 }}>
      <Tag
        className="uppercase m-0"
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: 1,
          border: `1.5px solid ${INK}`,
          borderRadius: 20,
          padding: "8px 20px",
        }}
      >
        {text}
      </Tag>
    </div>
  );
}

function Dot() {
  return <span style={{ width: 10, height: 10, borderRadius: "50%", background: RED }} />;
}
