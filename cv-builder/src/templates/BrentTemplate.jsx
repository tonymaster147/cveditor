import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Brent" — monochrome. Archivo Black name, Oswald section titles on
// full-bleed light-grey bands, Lora body. Profile band across the page,
// then a 40% left column (Contact Details / Education / Skills /
// Languages / Certificates) beside a grey Work Experience panel.

const INK = "#1c1c1c";
const BAND = "#ececec";
const PANEL = "#f3f3f3";
const PANEL_BAND = "#e7e7e7";
const HEAD = "'Oswald', sans-serif";
const BODY = "'Lora', serif";

export default function BrentTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: "#fff", overflow: "hidden", fontFamily: BODY, color: INK }}>
      <div style={{ padding: "44px 46px 22px" }}>
        <Editable
          as="h1"
          value={data.name}
          onChange={(v) => update(["name"], v)}
          className="m-0 uppercase"
          style={{ fontFamily: "'Archivo Black', sans-serif", fontWeight: 400, fontSize: 46, letterSpacing: 0.5, color: "#111", lineHeight: 1 }}
        />
        <Editable
          as="div"
          value={data.role}
          onChange={(v) => update(["role"], v)}
          style={{ fontWeight: 600, fontSize: 21, color: "#222", marginTop: 8, lineHeight: 1.3 }}
        />
      </div>

      <Band text="Profile" size={23} padding="9px 46px" />
      <Editable
        as="p"
        value={data.summary}
        onChange={(v) => update(["summary"], v)}
        multiline
        style={{ margin: 0, padding: "16px 46px 26px", fontSize: 14, lineHeight: 1.5, color: "#232323" }}
      />

      <div style={{ display: "flex", gap: 26, alignItems: "stretch" }}>
        {/* LEFT */}
        <div style={{ width: "40%", flexShrink: 0 }}>
          <Band text="Contact Details" />
          <Block>
            <IconRow icon={<PinIcon />}>
              <Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} />
            </IconRow>
            <IconRow icon={<PhoneIcon />}>
              <Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} />
            </IconRow>
            <IconRow icon={<MailIcon />}>
              <Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} />
            </IconRow>
            <IconRow icon={<GlobeIcon />}>
              <Editable as="span" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
            </IconRow>
          </Block>

          <Band text="Education" />
          <Block>
            {blocks.education((ed, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <Editable
                  as="div"
                  value={ed.degree}
                  onChange={(v) => update(["education", i, "degree"], v)}
                  style={{ fontWeight: 700 }}
                />
                <div>
                  <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                  {", "}
                  <Editable as="span" value={ed.location} onChange={(v) => update(["education", i, "location"], v)} />
                </div>
                <Editable as="div" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
              </div>
            ))}
          </Block>

          <Band text="Skills" />
          <div style={{ padding: "10px 20px 18px 46px" }}>
            <ul className="brent-list">
              {(data.skills || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <Band text="Languages" />
          <Block>
            {blocks.languages((l, i) => (
              <div key={i}>
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
                {" - "}
                <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />
              </div>
            ))}
          </Block>

          <Band text="Certificates" />
          <Block>
            {blocks.courses((c, i) => (
              <Editable key={i} as="div" value={c.title} onChange={(v) => update(["courses", i, "title"], v)} />
            ))}
          </Block>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, background: PANEL, paddingBottom: 40 }}>
          <Band text="Work Experience" size={24} padding="8px 24px" bg={PANEL_BAND} />
          <div style={{ padding: "16px 28px 0" }}>
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 18, color: INK }}
                />
                <div style={{ fontSize: 13, color: "#333", marginTop: 3 }}>
                  <Editable as="span" value={exp.company} onChange={(v) => update(["experience", i, "company"], v)} />
                  {", "}
                  <Editable as="span" value={exp.location} onChange={(v) => update(["experience", i, "location"], v)} />
                </div>
                <Editable
                  as="div"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontSize: 13, color: "#333" }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="brent-bullets"
                  bullet="•"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .brent-list { margin: 0; padding-left: 18px; list-style: disc; }
        .brent-list > li { font-size: 13.5px; line-height: 1.45; margin-bottom: 4px; }
        .brent-bullets { margin: 8px 0 0; padding: 0; list-style: none; }
        .brent-bullets > li { font-size: 13.5px; line-height: 1.45; margin-bottom: 5px; }
      `}</style>
    </div>
  );
}

function Band({ text, size = 21, padding = "8px 20px 8px 46px", bg = BAND }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ background: bg, padding }}>
      <Tag className="m-0" style={{ fontFamily: HEAD, fontWeight: 600, fontSize: size, color: INK }}>
        {text}
      </Tag>
    </div>
  );
}

function Block({ children }) {
  return (
    <div style={{ padding: "14px 20px 22px 46px", fontSize: 14, color: "#222", lineHeight: 1.55 }}>{children}</div>
  );
}

function IconRow({ icon, children }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#333" style={{ marginTop: 3, flexShrink: 0 }}>
        {icon}
      </svg>
      <div style={{ wordBreak: "break-word" }}>{children}</div>
    </div>
  );
}

function PinIcon() {
  return <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />;
}

function PhoneIcon() {
  return (
    <path d="M20 15.5a12.5 12.5 0 01-3.9-.6 1 1 0 00-1 .2l-2 2a15 15 0 01-6.6-6.6l2-2a1 1 0 00.2-1A12.5 12.5 0 018 3.5a1 1 0 00-1-1H4a1 1 0 00-1 1A17 17 0 0020 21a1 1 0 001-1v-3a1 1 0 00-1-1z" />
  );
}

function MailIcon() {
  return <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 4l8 5 8-5V6l-8 5-8-5v2z" />;
}

function GlobeIcon() {
  return (
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 6h-2.9a15 15 0 00-1-3.2A8 8 0 0118.9 8zM12 4.2c.7.5 1.6 1.9 2.1 3.8H9.9C10.4 6.1 11.3 4.7 12 4.2zM4.3 14a8 8 0 010-4h2.8a20 20 0 000 4H4.3zm.8 2h2.9a15 15 0 001 3.2A8 8 0 015.1 16zm2.9-8H5.1a8 8 0 012.9-3.2 15 15 0 00-1 3.2zm3.8 11.8c-.7-.5-1.6-1.9-2.1-3.8h4.2c-.5 1.9-1.4 3.3-2.1 3.8zM9.4 14a18 18 0 010-4h5.2a18 18 0 010 4H9.4zm6.5 5.2a15 15 0 001-3.2h2.9a8 8 0 01-3.9 3.2zM16.9 14a20 20 0 000-4h2.8a8 8 0 010 4h-2.8z" />
  );
}
