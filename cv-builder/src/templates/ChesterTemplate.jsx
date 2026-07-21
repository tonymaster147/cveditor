import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Chester" — classic navy + serif CV. Header uses a navy L-shape (top
// band + narrow left band) with a bordered white card inset containing
// the Playfair name and tracked-out sub-role and contact row. Body:
// blush-cream left sidebar (Skills / Education / References) + right
// column with navy PROFILE and EXPERIENCE header bars.
//
// Source design is 1080px letter — sizes scaled to fit our 794px A4 page.

const NAVY = "#2f5c8f";
const BLUSH = "#f4eae7";
const RULE_BLUSH = "#cbb8b2";
const HEADING = "#2b2b2b";
const BODY = "#3a3a3a";
const FONT = "'Mulish', sans-serif";
const SERIF = "'Playfair Display', serif";

export default function ChesterTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page flex flex-col" style={{ fontFamily: FONT, color: BODY }}>
      {/* HEADER */}
      <div style={{ position: "relative", height: 220 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 290, height: 130, background: NAVY }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 28, height: 220, background: NAVY }} />
        <div
          className="flex flex-col items-center justify-center box-border"
          style={{
            position: "absolute",
            top: 36,
            left: 40,
            right: 40,
            bottom: 20,
            background: "#fff",
            border: "1px solid #cfcfcf",
            padding: "20px 22px",
          }}
        >
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 46, letterSpacing: 6, color: HEADING, lineHeight: 1 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            className="uppercase"
            style={{ fontSize: 14, letterSpacing: 8, color: "#4a4a4a", marginTop: 12, fontWeight: 400 }}
          />
          <div className="flex flex-wrap items-center justify-center" style={{ gap: 24, marginTop: 18, fontSize: 12, color: BODY }}>
            <span className="flex items-center" style={{ gap: 8 }}>
              <PhoneIcon />
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </span>
            <span className="flex items-center" style={{ gap: 8 }}>
              <MailIcon />
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </span>
            <span className="flex items-center" style={{ gap: 8 }}>
              <PinIcon />
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1" style={{ alignItems: "stretch" }}>
        {/* LEFT SIDEBAR */}
        <aside
          className="flex-none box-border"
          style={{ width: 275, background: BLUSH, padding: "40px 28px 44px 40px" }}
        >
          <SideTitle text="Skills" mt={0} />
          <EditableList
            items={data.skills}
            onChange={(v) => update(["skills"], v)}
            className="chester-list"
            bullet="•"
          />

          <SideTitle text="Education" mt={40} />
          {blocks.education((ed, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 22 }}>
              <Editable
                as="div"
                value={ed.school}
                onChange={(v) => update(["education", i, "school"], v)}
                className="uppercase"
                style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.2, color: HEADING }}
              />
              <Editable
                as="div"
                value={ed.degree}
                onChange={(v) => update(["education", i, "degree"], v)}
                style={{ fontSize: 14.5, marginTop: 6, color: BODY }}
              />
              <Editable
                as="div"
                value={ed.date}
                onChange={(v) => update(["education", i, "date"], v)}
                style={{ fontSize: 14.5, color: BODY }}
              />
            </div>
          ))}

          <SideTitle text="References" mt={40} />
          {blocks.references((r, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 18 }}>
              <Editable
                as="div"
                value={r.name}
                onChange={(v) => update(["references", i, "name"], v)}
                className="uppercase"
                style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.2, color: HEADING }}
              />
              <Editable
                as="div"
                value={r.role}
                onChange={(v) => update(["references", i, "role"], v)}
                style={{ fontSize: 14, marginTop: 6, color: BODY }}
              />
              <div className="flex items-center" style={{ gap: 8, marginTop: 10, fontSize: 13.5 }}>
                <PhoneIcon small />
                <Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} />
              </div>
              <div className="flex items-center" style={{ gap: 8, marginTop: 6, fontSize: 13.5 }}>
                <MailIcon small />
                <Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} />
              </div>
            </div>
          ))}

          <style>{`
            .chester-list { margin: 0; padding-left: 20px; list-style: disc; }
            .chester-list > li { font-size: 14.5px; line-height: 2; color: ${BODY}; }
          `}</style>
        </aside>

        {/* RIGHT */}
        <div className="flex-1 box-border" style={{ padding: "40px 40px 44px 32px" }}>
          <BarTitle text="Profile" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 14.5, lineHeight: 1.65, margin: "16px 0 0", color: BODY }}
          />

          <BarTitle text="Experience" mt={34} />
          {blocks.experience((exp, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 22 : 24 }}>
              <Editable
                as="div"
                value={exp.title}
                onChange={(v) => update(["experience", i, "title"], v)}
                className="uppercase"
                style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: HEADING }}
              />
              <Editable
                as="div"
                value={exp.company}
                onChange={(v) => update(["experience", i, "company"], v)}
                style={{ fontSize: 14.5, marginTop: 4 }}
              />
              <Editable
                as="div"
                value={exp.date}
                onChange={(v) => update(["experience", i, "date"], v)}
                style={{ fontSize: 14.5 }}
              />
              <EditableList
                items={exp.bullets}
                onChange={(v) => update(["experience", i, "bullets"], v)}
                className="chester-exp-list"
                bullet="•"
              />
            </div>
          ))}

          <style>{`
            .chester-exp-list { margin: 10px 0 0; padding-left: 22px; list-style: disc; }
            .chester-exp-list > li { font-size: 14.5px; line-height: 1.5; color: ${BODY}; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function SideTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="uppercase"
        style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, color: HEADING, marginTop: mt }}
      >
        {text}
      </Tag>
      <div style={{ height: 2, background: RULE_BLUSH, margin: "10px 0 18px" }} />
    </>
  );
}

function BarTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="text-center uppercase"
      style={{
        background: NAVY,
        color: "#fff",
        padding: 12,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 3,
        marginTop: mt || 0,
      }}
    >
      {text}
    </Tag>
  );
}

function PhoneIcon({ small }) {
  const s = small ? 14 : 15;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={HEADING}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2z" />
    </svg>
  );
}
function MailIcon({ small }) {
  const s = small ? 14 : 15;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={HEADING}>
      <path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm9 7L4 7v1l8 5 8-5V7l-8 5z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={HEADING}>
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}
