import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Merton" — Montserrat headings, Lato body. Lilac-grey sidebar with
// spaced plum headings over full-width rules (Contact / Skills /
// Languages). Plum header banner with a near-black edge strip. Main
// column sections hang from square plum icon tiles joined by a vertical
// rail, with small square markers for each entry.

const PLUM = "#5d2a44";
const DARK = "#1c1116";
const LILAC = "#ecebf0";
const TEXT = "#2f2f2f";
const HEAD = "'Montserrat', sans-serif";
const BODY = "'Lato', sans-serif";

const ICONS = {
  profile: <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />,
  education: <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm0 15-6-3.27v2.54L12 21l6-3.73v-2.54L12 18z" />,
  experience: (
    <path d="M10 3h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v4H2V9a2 2 0 0 1 2-2h4V5a2 2 0 0 1 2-2zm0 2v2h4V5h-4zM2 15h8v1h4v-1h8v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4z" />
  ),
  achievements: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" />
    </>
  ),
};

export default function MertonTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div
      className="cv-page"
      style={{ display: "flex", background: LILAC, overflow: "hidden", fontFamily: BODY, color: TEXT }}
    >
      {/* SIDEBAR */}
      <aside style={{ width: 255, flex: "0 0 255px", padding: "222px 28px 40px 40px" }}>
        <SideHead text="Contact" mt={0} />
        <ContactItem label="Phone:" icon={<PhoneIcon />}>
          <Editable as="div" value={data.phone} onChange={(v) => update(["phone"], v)} />
        </ContactItem>
        <ContactItem label="Email Address:" icon={<MailIcon />}>
          <Editable as="div" value={data.email} onChange={(v) => update(["email"], v)} />
        </ContactItem>
        <ContactItem label="Address:" icon={<PinIcon />}>
          <Editable as="div" value={data.location} onChange={(v) => update(["location"], v)} />
        </ContactItem>
        <ContactItem label="LinkedIn" icon={<GlobeIcon />}>
          <Editable as="div" value={data.linkedin} onChange={(v) => update(["linkedin"], v)} />
        </ContactItem>

        <SideHead text="Skills" />
        <ul className="mer-list">
          {(data.skills || []).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <SideHead text="Languages" />
        <ul className="mer-list">
          {blocks.languages((l, i) => (
            <li key={i}>
              <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} /> (
              <Editable as="span" value={l.level} onChange={(v) => update(["languages", i, "level"], v)} />)
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, background: "#fff" }}>
        <div style={{ display: "flex", height: 214 }}>
          <div style={{ width: 38, background: DARK }} />
          <div
            style={{
              flex: 1,
              background: PLUM,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 30px 0 50px",
            }}
          >
            <Editable
              as="h1"
              value={data.name}
              onChange={(v) => update(["name"], v)}
              className="m-0 uppercase"
              style={{ fontFamily: HEAD, fontWeight: 800, color: "#fff", fontSize: 38, letterSpacing: 1.5, lineHeight: 1 }}
            />
            <Editable
              as="div"
              value={data.role}
              onChange={(v) => update(["role"], v)}
              className="uppercase"
              style={{ color: "#e8d8df", fontSize: 15, letterSpacing: 0.8, lineHeight: 1.35, marginTop: 10 }}
            />
          </div>
        </div>

        <div style={{ padding: "32px 38px 40px 30px" }}>
          <RailSection text="Profile" icon="profile">
            <Editable
              as="p"
              value={data.summary}
              onChange={(v) => update(["summary"], v)}
              multiline
              style={{ fontSize: 12, color: "#3a3a3a", lineHeight: 1.6, textAlign: "justify", margin: 0 }}
            />
          </RailSection>

          <RailSection text="Experience" icon="experience">
            {blocks.experience((exp, i) => (
              <Entry key={i} mb={14}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <Editable
                    as="span"
                    value={exp.title}
                    onChange={(v) => update(["experience", i, "title"], v)}
                    style={{ fontWeight: 700, color: "#242424", fontSize: 13.5 }}
                  />
                  <Editable
                    as="span"
                    value={exp.date}
                    onChange={(v) => update(["experience", i, "date"], v)}
                    className="uppercase"
                    style={{ color: PLUM, fontSize: 11, letterSpacing: 0.4, whiteSpace: "nowrap" }}
                  />
                </div>
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontSize: 12, color: "#4a4a4a", fontStyle: "italic", marginTop: 1 }}
                />
                <EditableList
                  items={exp.bullets}
                  onChange={(v) => update(["experience", i, "bullets"], v)}
                  className="mer-bullets"
                  bullet="•"
                />
              </Entry>
            ))}
          </RailSection>

          <RailSection text="Education" icon="education">
            {blocks.education((ed, i) => (
              <Entry key={i} mb={12}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <Editable
                    as="span"
                    value={ed.degree}
                    onChange={(v) => update(["education", i, "degree"], v)}
                    style={{ fontWeight: 700, color: "#242424", fontSize: 13.5 }}
                  />
                  <Editable
                    as="span"
                    value={ed.date}
                    onChange={(v) => update(["education", i, "date"], v)}
                    style={{ color: "#555", fontSize: 11, whiteSpace: "nowrap" }}
                  />
                </div>
                <div style={{ fontSize: 12, color: "#4a4a4a", marginTop: 1 }}>
                  <Editable as="span" value={ed.school} onChange={(v) => update(["education", i, "school"], v)} />
                  {" | "}
                  <Editable as="span" value={ed.location} onChange={(v) => update(["education", i, "location"], v)} />
                </div>
              </Entry>
            ))}
          </RailSection>

          <RailSection text="Achievements" icon="achievements" last>
            {blocks.achievements((a, i) => (
              <Entry key={i} mb={10}>
                <p style={{ fontSize: 12, color: "#3a3a3a", lineHeight: 1.55, margin: 0 }}>
                  <Editable
                    as="span"
                    value={a.title}
                    onChange={(v) => update(["achievements", i, "title"], v)}
                    style={{ fontWeight: 700, fontStyle: "italic" }}
                  />
                  {": "}
                  <Editable as="span" value={a.text} onChange={(v) => update(["achievements", i, "text"], v)} multiline />
                </p>
              </Entry>
            ))}
          </RailSection>
        </div>
      </main>

      <style>{`
        .mer-list { margin: 0; padding: 0; list-style: none; }
        .mer-list li { position: relative; padding-left: 16px; margin-bottom: 7px; font-size: 12.5px; color: ${TEXT}; line-height: 1.35; }
        .mer-list li:before { content: ""; position: absolute; left: 2px; top: 6px; width: 4.5px; height: 4.5px; border-radius: 50%; background: #3a3a3a; }
        .mer-bullets { margin: 4px 0 0; padding: 0; list-style: none; }
        .mer-bullets > li { font-size: 12px; line-height: 1.5; color: #3a3a3a; margin-bottom: 2px; }
      `}</style>
    </div>
  );
}

function SideHead({ text, mt = 28 }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <>
      <Tag
        className="m-0 uppercase"
        style={{ fontFamily: HEAD, fontWeight: 700, color: PLUM, fontSize: 17, letterSpacing: 3, marginTop: mt }}
      >
        {text}
      </Tag>
      <div style={{ height: 2, background: PLUM, margin: "5px 0 14px" }} />
    </>
  );
}

function ContactItem({ label, icon, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 1 }}>
        {icon}
        <span style={{ fontWeight: 700, color: PLUM, fontSize: 12.5 }}>{label}</span>
      </div>
      <div style={{ fontSize: 12.5, color: TEXT, wordBreak: "break-word" }}>{children}</div>
    </div>
  );
}

function RailSection({ text, icon, last, children }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", marginBottom: last ? 0 : 24 }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 30,
            height: 30,
            background: PLUM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
            {ICONS[icon]}
          </svg>
        </div>
        <div style={{ position: "absolute", left: 14, top: 30, bottom: 0, width: 2, background: PLUM }} />
      </div>
      <div style={{ paddingTop: 2 }}>
        <Tag
          className="m-0 uppercase"
          style={{ fontFamily: HEAD, fontWeight: 700, color: PLUM, fontSize: 19, letterSpacing: 2.2 }}
        >
          {text}
        </Tag>
        <div style={{ height: 2, background: PLUM, margin: "7px 0 12px" }} />
        {children}
      </div>
    </div>
  );
}

function Entry({ mb, children }) {
  return (
    <div style={{ position: "relative", marginBottom: mb }}>
      <span style={{ position: "absolute", left: -33, top: 4, width: 7, height: 7, background: PLUM }} />
      {children}
    </div>
  );
}

const iconProps = {
  width: 12,
  height: 12,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: PLUM,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
