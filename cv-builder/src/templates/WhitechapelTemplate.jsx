import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Whitechapel" — warm cream (#e7e4e0) page with a huge Playfair Display
// name, dark-brown contact strip with icon-circle contacts, a rounded
// pill-border summary card, then a brown-timeline Experience section
// and Education / References under big Playfair section titles.

const PAGE = "#e7e4e0";
const INK = "#3a2416";
const STRIP = "#4a2f1e";
const BROWN = "#7a5a42";
const SERIF_HEAD = "'Playfair Display', serif";
const SERIF = "'PT Serif', serif";

export default function WhitechapelTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: PAGE, fontFamily: SERIF, color: INK, paddingBottom: 46 }}>
      {/* HEADER NAME */}
      <div className="text-center" style={{ padding: "42px 44px 16px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: SERIF_HEAD, fontWeight: 900, fontSize: 62, letterSpacing: 2, color: INK, lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontStyle: "italic", fontWeight: 700, fontSize: 22, color: INK, marginTop: 12 }}
        />
      </div>

      {/* CONTACT STRIP */}
      <div
        className="flex flex-wrap"
        style={{
          background: STRIP,
          color: "#fff",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 30px",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 15,
          gap: 12,
        }}
      >
        <StripItem letter="✆">
          <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
        </StripItem>
        <StripItem letter="✉">
          <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
        </StripItem>
        <StripItem letter="●">
          <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
        </StripItem>
      </div>

      {/* PILL SUMMARY */}
      <div style={{ padding: "24px 44px 0" }}>
        <div style={{ border: `1.5px solid ${BROWN}`, borderRadius: 44, padding: "20px 28px" }}>
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ margin: 0, fontStyle: "italic", fontWeight: 700, fontSize: 17, lineHeight: 1.5, color: INK }}
          />
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "22px 44px 0" }}>
        <SerifHeading text="Work Experience" />
        <div style={{ borderLeft: `2px solid ${INK}`, paddingLeft: 24, marginLeft: 4 }}>
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 10 : 22 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 20, color: BROWN }}
                />
                <Editable
                  as="span"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontStyle: "italic", fontWeight: 700, fontSize: 16, color: BROWN }}
                />
              </div>
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="whi-list"
                bullet="•"
              />
            </div>
          ))}
        </div>

        <SerifHeading text="Education" mt={22} />
        <div style={{ paddingLeft: 28 }}>
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 6 : 16 }}>
              <div className="flex justify-between items-baseline">
                <Editable
                  as="span"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 20, color: INK }}
                />
                <Editable
                  as="span"
                  value={ed.date}
                  onChange={(v) => update(["education", i, "date"], v)}
                  style={{ fontStyle: "italic", fontWeight: 700, fontSize: 16, color: BROWN, whiteSpace: "nowrap" }}
                />
              </div>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}
              />
            </div>
          ))}
        </div>

        <SerifHeading text="References" mt={18} />
        <div style={{ paddingLeft: 28 }}>
          {(data.references || []).length > 0 ? (
            blocks.references((r, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 6 : 12, fontStyle: "italic", fontWeight: 700, fontSize: 15 }}>
                <Editable as="span" value={r.name} onChange={(v) => update(["references", i, "name"], v)} />
                {" · "}
                <Editable as="span" value={r.role} onChange={(v) => update(["references", i, "role"], v)} />
              </div>
            ))
          ) : (
            <div style={{ fontStyle: "italic", fontWeight: 700, fontSize: 15 }}>Available upon request</div>
          )}
        </div>
      </div>

      <style>{`
        .whi-list { margin: 8px 0 0 18px; padding-left: 0; list-style: disc; }
        .whi-list > li { font-size: 15px; line-height: 1.45; margin-bottom: 4px; }
      `}</style>
    </div>
  );
}

function SerifHeading({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="m-0"
      style={{ fontFamily: SERIF_HEAD, fontWeight: 900, fontSize: 38, color: INK, marginTop: mt || 0, marginBottom: 4 }}
    >
      {text}
    </Tag>
  );
}

function StripItem({ letter, children }) {
  return (
    <span className="inline-flex items-center" style={{ gap: 8 }}>
      <span
        className="inline-flex items-center justify-center flex-none"
        style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", color: STRIP, fontSize: 11 }}
      >
        {letter}
      </span>
      {children}
    </span>
  );
}
