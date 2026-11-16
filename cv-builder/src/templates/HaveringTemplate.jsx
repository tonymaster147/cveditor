import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Havering" — warm off-white page, slate Oswald headings, PT Serif body.
// Big two-line name with italic role; right-aligned contact lines with
// teal circle icons. Summary framed by teal double rules, 3-column
// skills, work experience, then a 3-up Education / Languages /
// Certificates footer under another double rule.

const SLATE = "#37474f";
const TEAL = "#6e9b98";
const TEXT = "#2f3d44";
const HEAD = "'Oswald', sans-serif";
const BODY = "'PT Serif', serif";

export default function HaveringTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ background: "#f4f3f1", overflow: "hidden", padding: "52px 58px 56px", fontFamily: BODY, color: TEXT }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30 }}>
        <div style={{ minWidth: 0 }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 58, lineHeight: 0.98, color: SLATE, letterSpacing: 0.5, maxWidth: 330 }}
          />
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "#51666e", marginTop: 10, lineHeight: 1.35 }}
          />
        </div>
        <div style={{ fontSize: 14, color: SLATE, textAlign: "right", flexShrink: 0 }}>
          <ContactRow icon={<PhoneIcon />}>
            <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
          </ContactRow>
          <ContactRow icon={<MailIcon />}>
            <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
          </ContactRow>
          <ContactRow icon={<PinIcon />}>
            <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
          </ContactRow>
          <ContactRow icon={<GlobeIcon />} last>
            <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
          </ContactRow>
        </div>
      </div>

      <DoubleRule mt={24} />
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ margin: "16px 0", fontSize: 14, lineHeight: 1.65, textAlign: "justify", color: TEXT }}
      />
      <DoubleRule />

      <Sec text="Skills" mt={20} mb={4} />
      <ul className="hav-list hav-cols">
        {(data.skills || []).map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <Sec text="Work Experience" mt={22} mb={8} />
      {blocks.experience((exp, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <Editable
            as="div"
            value={exp.title}
            onChange={(v) => update(["experience", i, "title"], v)}
            style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 19, color: SLATE }}
          />
          <div style={{ fontSize: 13.5, color: "#374750", marginTop: 2 }}>
            <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
            {", "}
            <Editable as="span" value={exp.location} onChange={(v) => update(["experience", i, "location"], v)} />
          </div>
          <Editable
            as="div"
            value={exp.date}
            onChange={(v) => update(["experience", i, "date"], v)}
            style={{ fontSize: 13.5, color: "#374750" }}
          />
          <EditableList
            items={exp.bullets}
            onChange={(v) => update(["experience", i, "bullets"], v)}
            className="hav-bullets"
            bullet="•"
          />
        </div>
      ))}

      <DoubleRule mt={8} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: 28, marginTop: 20 }}>
        <div>
          <Sec text="Education" />
          <div style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.5 }}>
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontWeight: 700 }}
                />
                <Editable as="div" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                <Editable as="div" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Sec text="Languages" />
          <ul className="hav-list" style={{ marginTop: 10 }}>
            {blocks.languages((l, i) => (
              <li key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                {" - "}
                <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Sec text="Certificates" />
          <ul className="hav-list" style={{ marginTop: 10 }}>
            {blocks.courses((c, i) => (
              <li key={i}>
                <Editable as="span" value={c.title} onChange={(v) => update(["courses", i, "title"], v)} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .hav-list { margin: 6px 0 0; padding-left: 18px; list-style: disc; }
        .hav-list li { font-size: 13.5px; line-height: 1.45; margin-bottom: 5px; color: ${TEXT}; display: list-item; }
        .hav-cols { columns: 3; column-gap: 28px; }
        .hav-cols > li { break-inside: avoid; }
        .hav-bullets { margin: 6px 0 0; padding: 0; list-style: none; }
        .hav-bullets > li { font-size: 13.5px; line-height: 1.45; margin-bottom: 3px; color: ${TEXT}; }
      `}</style>
    </div>
  );
}

function Sec({ text, mt = 0, mb = 0 }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <Tag
      className="m-0 uppercase"
      style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 24, letterSpacing: 1, color: SLATE, marginTop: mt, marginBottom: mb }}
    >
      {text}
    </Tag>
  );
}

function DoubleRule({ mt = 0 }) {
  return <div style={{ height: 7, borderTop: `2.5px solid ${TEAL}`, borderBottom: `2.5px solid ${TEAL}`, marginTop: mt }} />;
}

function ContactRow({ icon, last, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginBottom: last ? 0 : 8 }}>
      <span>{children}</span>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: TEAL,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
          {icon}
        </svg>
      </span>
    </div>
  );
}

function PhoneIcon() {
  return (
    <path d="M20 15.5a12.5 12.5 0 01-3.9-.6 1 1 0 00-1 .2l-2 2a15 15 0 01-6.6-6.6l2-2a1 1 0 00.2-1A12.5 12.5 0 018 3.5a1 1 0 00-1-1H4a1 1 0 00-1 1A17 17 0 0020 21a1 1 0 001-1v-3a1 1 0 00-1-1z" />
  );
}

function MailIcon() {
  return <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 4l8 5 8-5V6l-8 5-8-5v2z" />;
}

function PinIcon() {
  return <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />;
}

function GlobeIcon() {
  return (
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 6h-2.9a15 15 0 00-1-3.2A8 8 0 0118.9 8zM12 4.2c.7.5 1.6 1.9 2.1 3.8H9.9C10.4 6.1 11.3 4.7 12 4.2zM4.3 14a8 8 0 010-4h2.8a20 20 0 000 4H4.3zm.8 2h2.9a15 15 0 001 3.2A8 8 0 015.1 16zm2.9-8H5.1a8 8 0 012.9-3.2 15 15 0 00-1 3.2zm3.8 11.8c-.7-.5-1.6-1.9-2.1-3.8h4.2c-.5 1.9-1.4 3.3-2.1 3.8zM9.4 14a18 18 0 010-4h5.2a18 18 0 010 4H9.4zm6.5 5.2a15 15 0 001-3.2h2.9a8 8 0 01-3.9 3.2zM16.9 14a20 20 0 000-4h2.8a8 8 0 010 4h-2.8z" />
  );
}
