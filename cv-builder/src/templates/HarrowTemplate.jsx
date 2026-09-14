import Editable from "../components/Editable";
import { useIsThumbnail } from "./ThumbnailContext";
import EditableList from "../components/EditableList";
import { makeBlocks } from "./blockHelpers";

// "Harrow" — deep-blue L-shape header: a top strip on the right, a
// left rectangle down the side, and a bottom bar with the tracked-out
// role — with the blue Poppins name centered in the white cutout. Body:
// 2-col with diamond-outlined section headings, a blue vertical rail on
// Work Experience, and blue-dot bullet lists in the sidebar.

const BLUE = "#1c22b6";
const FONT = "'Poppins', sans-serif";

export default function HarrowTemplate({ data, update /*, accent */ }) {
  const blocks = makeBlocks(data, update);

  return (
    <div className="cv-page" style={{ background: "#fff", fontFamily: FONT, color: BLUE, overflow: "hidden" }}>
      {/* L-SHAPE HEADER */}
      <div style={{ position: "relative", height: 130 }}>
        <div style={{ position: "absolute", top: 0, left: 165, right: 0, height: 28, background: BLUE }} />
        <div style={{ position: "absolute", top: 42, left: 0, width: 165, bottom: 0, background: BLUE }} />
        <div
          className="flex items-center justify-center"
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 30, background: BLUE }}
        >
          <Editable
            as="div"
            value={data.role}
            onChange={(v) => update(["role"], v)}
            style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}
          />
        </div>
        <div className="text-center" style={{ position: "absolute", top: 36, left: 0, right: 0 }}>
          <Editable
            as="h1"
            value={data.name}
            onChange={(v) => update(["name"], v)}
            className="m-0 uppercase"
            style={{ fontWeight: 800, fontSize: 38, color: BLUE, letterSpacing: 1 }}
          />
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 32, padding: "24px 32px 30px" }}>
        {/* LEFT */}
        <div>
          <DiamondTitle text="Summary" />
          <Editable
            as="p"
            value={data.summary}
            onChange={(v) => update(["summary"], v)}
            multiline
            style={{ fontSize: 11.5, lineHeight: 1.75, textAlign: "justify", marginTop: 12, color: BLUE }}
          />

          <DiamondTitle text="Work Experience" mt={22} />
          <div style={{ borderLeft: `2px solid ${BLUE}`, paddingLeft: 18, marginTop: 16, marginLeft: 2 }}>
            {blocks.experience((exp, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <Editable
                  as="div"
                  value={exp.title}
                  onChange={(v) => update(["experience", i, "title"], v)}
                  style={{ fontWeight: 700, fontSize: 13 }}
                />
                <Editable
                  as="div"
                  value={exp.company}
                  onChange={(v) => update(["experience", i, "company"], v)}
                  style={{ fontSize: 12, marginTop: 2 }}
                />
                <Editable
                  as="div"
                  value={exp.date}
                  onChange={(v) => update(["experience", i, "date"], v)}
                  style={{ fontStyle: "italic", fontSize: 11.5, marginTop: 2 }}
                />
                <ul className="flex flex-col" style={{ listStyle: "none", padding: 0, margin: "8px 0 0", gap: 6 }}>
                  {(exp.bullets || []).map((b, bi) => (
                    <li key={bi} className="flex" style={{ gap: 8 }}>
                      <span
                        style={{
                          minWidth: 5,
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: BLUE,
                          marginTop: 6,
                        }}
                      />
                      <Editable
                        as="span"
                        value={b}
                        onChange={(v) => {
                          const next = exp.bullets.slice();
                          next[bi] = v;
                          update(["experience", i, "bullets"], next);
                        }}
                        multiline
                        style={{ fontSize: 11.5, lineHeight: 1.5 }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <DiamondTitle text="References" mt={10} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            {blocks.references((r, i) => (
              <div key={i}>
                <Editable
                  as="div"
                  value={r.name}
                  onChange={(v) => update(["references", i, "name"], v)}
                  style={{ fontWeight: 700, fontSize: 13 }}
                />
                <Editable
                  as="div"
                  value={r.role}
                  onChange={(v) => update(["references", i, "role"], v)}
                  style={{ fontSize: 11.5, marginTop: 2 }}
                />
                <div style={{ fontSize: 10.5, marginTop: 8, lineHeight: 1.6 }}>
                  <div><b>Phone:</b>{" "}<Editable as="span" value={r.phone} onChange={(v) => update(["references", i, "phone"], v)} /></div>
                  <div><b>Email :</b>{" "}<Editable as="span" value={r.email} onChange={(v) => update(["references", i, "email"], v)} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <DiamondTitle text="Education" />
          <div className="flex flex-col" style={{ marginTop: 14, gap: 16 }}>
            {blocks.education((ed, i) => (
              <div key={i}>
                <Editable
                  as="div"
                  value={ed.school}
                  onChange={(v) => update(["education", i, "school"], v)}
                  style={{ fontWeight: 700, fontSize: 12 }}
                />
                <div style={{ fontSize: 11.5, lineHeight: 1.45, marginTop: 3 }}>
                  <Editable as="span" value={ed.degree} onChange={(v) => update(["education", i, "degree"], v)} />
                  <br />
                  <Editable as="span" value={ed.date} onChange={(v) => update(["education", i, "date"], v)} />
                </div>
              </div>
            ))}
          </div>

          <DiamondTitle text="Skills" mt={22} />
          <ul className="flex flex-col" style={{ listStyle: "none", marginTop: 14, gap: 10, padding: 0 }}>
            {(data.skills || []).map((s, i) => (
              <li key={i} className="flex items-center" style={{ gap: 10, fontSize: 12 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: BLUE, display: "inline-block" }} />
                {s}
              </li>
            ))}
          </ul>

          <DiamondTitle text="Language" mt={22} />
          <ul className="flex flex-col" style={{ listStyle: "none", marginTop: 14, gap: 6, padding: 0 }}>
            {blocks.languages((l, i) => (
              <li key={i} className="flex items-center" style={{ gap: 10, fontSize: 12 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: BLUE, display: "inline-block" }} />
                <Editable as="span" value={l.name} onChange={(v) => update(["languages", i, "name"], v)} />
              </li>
            ))}
          </ul>

          <div className="flex flex-col" style={{ gap: 12, marginTop: 20, fontSize: 11.5 }}>
            <IconLine icon="✆"><Editable as="span" value={data.phone} onChange={(v) => update(["phone"], v)} /></IconLine>
            <IconLine icon="✉"><Editable as="span" value={data.email} onChange={(v) => update(["email"], v)} /></IconLine>
            <IconLine icon="●"><Editable as="span" value={data.location} onChange={(v) => update(["location"], v)} /></IconLine>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiamondTitle({ text, mt }) {
  const Tag = useIsThumbnail() ? "div" : "h2";
  return (
    <div style={{ marginTop: mt || 0 }}>
      <div className="flex items-center" style={{ gap: 10 }}>
        <span
          style={{
            display: "inline-block",
            width: 13,
            height: 13,
            border: `1.5px solid ${BLUE}`,
            transform: "rotate(45deg)",
          }}
        />
        <Tag className="m-0" style={{ fontWeight: 700, fontSize: 17, color: BLUE }}>
          {text}
        </Tag>
      </div>
      <div style={{ height: 1.5, background: BLUE, marginTop: 10 }} />
    </div>
  );
}

function IconLine({ icon, children }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <span style={{ color: BLUE, fontSize: 12 }}>{icon}</span>
      {children}
    </div>
  );
}
