// Heuristic CV parser. Takes raw text extracted from a PDF or DOCX and
// returns data shaped like cv-builder's `initialData`. Accuracy is mediocre
// by design — see /server/routes/parseCv.js for the entry point. Users are
// expected to review and fix anything that's off after import.

// ---------------------------------------------------------------------------
// 1. Top-of-CV scalars (name, contact info)
// ---------------------------------------------------------------------------

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const LINKEDIN_RE = /(linkedin\.com\/[^\s|,()]+)/i;

// Common UK/intl locations are too varied to detect reliably without a
// gazetteer. We use a light heuristic: a comma-separated "Word, Word" near
// the top of the CV that doesn't contain digits.
const LOCATION_HINT_RE = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*(UK|United Kingdom|USA|United States|Canada|Australia|Ireland|[A-Z]{2,})\b/;

function extractContact(text) {
  const email = (text.match(EMAIL_RE) || [])[0] || "";
  const phone = (text.match(PHONE_RE) || [])[0]?.trim() || "";
  const linkedin = (text.match(LINKEDIN_RE) || [])[0] || "";
  const location = (text.match(LOCATION_HINT_RE) || [])[0] || "";
  return { email, phone, linkedin, location };
}

// Name = the first non-empty line that:
//   - has 2-4 words
//   - is mostly Title Case or ALL CAPS
//   - doesn't contain digits, @, or common section keywords
function extractName(rawLines) {
  for (const raw of rawLines.slice(0, 12)) {
    const line = raw.trim();
    if (!line || line.length > 60) continue;
    if (/[\d@/]|http/i.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length < 2 || words.length > 4) continue;
    if (/^(curriculum|cv|resume|profile|summary|contact|experience|education|skills)\b/i.test(line)) continue;
    // Title Case or ALL CAPS check
    const titleCase = words.every((w) => /^[A-Z][a-zA-Z'’.-]*$/.test(w));
    const allCaps = /^[A-Z\s'’.-]+$/.test(line) && /[A-Z]/.test(line);
    if (titleCase || allCaps) {
      // Normalise to Title Case for display
      return line.split(/\s+/).map((w) =>
        w[0].toUpperCase() + w.slice(1).toLowerCase()
      ).join(" ");
    }
  }
  return "";
}

// "Role" / headline is usually the line right after the name, before
// contact lines. Light heuristic — give up if unclear.
function extractRole(rawLines, name) {
  if (!name) return "";
  const nameIdx = rawLines.findIndex((l) => l.trim().toLowerCase() === name.toLowerCase());
  if (nameIdx === -1) return "";
  for (let i = nameIdx + 1; i < Math.min(rawLines.length, nameIdx + 6); i++) {
    const line = rawLines[i].trim();
    if (!line) continue;
    if (EMAIL_RE.test(line) || PHONE_RE.test(line) || /linkedin/i.test(line)) continue;
    if (line.length > 100) continue; // probably the summary, not a headline
    if (/^[A-Z]/.test(line)) return line; // headline-ish
  }
  return "";
}

// ---------------------------------------------------------------------------
// 2. Section detection
// ---------------------------------------------------------------------------

// Maps a normalised heading string to a canonical section key.
const SECTION_ALIASES = {
  summary: "summary", profile: "summary", about: "summary", objective: "summary",
  "personal statement": "summary", "professional summary": "summary",

  experience: "experience", "work experience": "experience",
  "professional experience": "experience", employment: "experience",
  "employment history": "experience", "career history": "experience",
  "work history": "experience",

  education: "education", "academic background": "education", qualifications: "education",
  "academic qualifications": "education",

  skills: "skills", "key skills": "skills", "core competencies": "skills",
  "technical skills": "skills", "areas of expertise": "skills",

  achievements: "achievements", "key achievements": "achievements",
  awards: "achievements", "awards & achievements": "achievements",
  accomplishments: "achievements",

  courses: "courses", "courses & certifications": "courses",
  certifications: "courses", training: "courses", "training & development": "courses",

  languages: "languages", "language skills": "languages",
};

function detectHeading(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 50) return null;
  // Strip trailing punctuation like ":" and surrounding decorations
  const cleaned = trimmed.replace(/[:_*•·\-—=]+$/g, "").trim().toLowerCase();
  return SECTION_ALIASES[cleaned] || null;
}

// Splits the document into named sections based on heading detection.
// Returns { header: [lines before any section], sections: { key: [lines...] } }
function splitSections(lines) {
  const out = { header: [], sections: {} };
  let current = null;
  for (const line of lines) {
    const heading = detectHeading(line);
    if (heading) {
      current = heading;
      if (!out.sections[current]) out.sections[current] = [];
      continue;
    }
    if (current) out.sections[current].push(line);
    else out.header.push(line);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 3. Experience / education parsing
// ---------------------------------------------------------------------------

// Match common date ranges. Captures things like:
//   "Jan 2020 - Present"
//   "01/2019 - 12/2022"
//   "2019 — 2022"
//   "March 2018 to August 2020"
const DATE_RANGE_RE = /((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\s*\d{1,2}?[\/.\s-]?\d{2,4}\s*(?:-|–|—|to)\s*(?:present|now|current|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\s*\d{1,2}?[\/.\s-]?\d{2,4}))/i;

const BULLET_RE = /^\s*[•·▪◦‣▸►▶★*\-–—]\s+(.+)$/;

function looksLikeBullet(line) {
  return BULLET_RE.test(line) || /^\s+\d+[.)]\s/.test(line);
}

function stripBullet(line) {
  const m = line.match(BULLET_RE);
  if (m) return m[1].trim();
  return line.replace(/^\s+\d+[.)]\s+/, "").trim();
}

// Experience items are detected by date ranges. Each date range starts a new
// item; lines above the date (within reason) are the title/company; bullets
// after belong to that item until the next date or section boundary.
function parseExperience(lines) {
  const items = [];
  let current = null;
  let pendingHeaderLines = []; // accumulator for lines before the first date

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      if (current) current.bullets = current.bullets; // keep
      continue;
    }
    const dateMatch = trimmed.match(DATE_RANGE_RE);
    if (dateMatch) {
      // Date found. Use it + the (up to) 2 lines before for the header.
      const date = dateMatch[0].trim();
      const headerCandidate = pendingHeaderLines.slice(-2).map((s) => s.trim()).filter(Boolean);
      // Some CVs put title + company on the SAME line as the date. Strip date.
      const lineWithoutDate = trimmed.replace(DATE_RANGE_RE, "").trim().replace(/^[•·\-–—,:|]+|[•·\-–—,:|]+$/g, "");
      if (lineWithoutDate) headerCandidate.push(lineWithoutDate);

      // Title is the bolder/shorter line; company is the other. We have no
      // formatting signals so we just take order: first = title, second = company.
      const title = headerCandidate[0] || "";
      const company = headerCandidate[1] || "";
      const location = (headerCandidate[2] || "").match(LOCATION_HINT_RE)?.[0] || "";

      current = { title, company, date, location, bullets: [] };
      items.push(current);
      pendingHeaderLines = [];
      continue;
    }
    if (looksLikeBullet(line) && current) {
      current.bullets.push(stripBullet(line));
      continue;
    }
    // Non-bullet, non-date line. Buffer it as a possible next header.
    pendingHeaderLines.push(line);
    // If we already have a current item and the line is short, treat it as a
    // continuation paragraph (turn into a "soft" bullet). Don't go wild.
    if (current && trimmed.length < 200 && current.bullets.length < 8) {
      // If the previous accumulated lines look like a paragraph, append.
      // Otherwise just hold off (it might be the start of the next item).
    }
  }
  // Final cleanup: drop items with no title AND no company
  return items.filter((it) => it.title || it.company);
}

function parseEducation(lines) {
  // Same heuristics as experience but rename fields.
  const exp = parseExperience(lines);
  return exp.map((e) => ({
    degree: e.title,
    school: e.company,
    date: e.date,
    location: e.location,
  }));
}

// ---------------------------------------------------------------------------
// 4. Other sections
// ---------------------------------------------------------------------------

function parseSummary(lines) {
  // Join non-empty lines, collapse whitespace.
  return lines.map((l) => l.trim()).filter(Boolean).join(" ").replace(/\s+/g, " ");
}

function parseSkills(lines) {
  const joined = lines.join("\n");
  // Skills are usually a list, possibly bulletted, possibly comma-separated,
  // possibly pipe-separated. We split on any of those and dedupe.
  const tokens = joined
    .split(/[•·,;|\n]|\s{2,}/)
    .map((s) => stripBullet(s).trim())
    .filter((s) => s && s.length < 60 && s.length > 1);
  // Dedupe case-insensitively, preserve original casing
  const seen = new Set();
  const out = [];
  for (const t of tokens) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out.slice(0, 20);
}

// Achievements / courses: each item = a heading line + a description.
// If structure is unclear, treat each non-empty line as a title with empty text.
function parseTitledItems(lines, titleKey, textKey) {
  const out = [];
  let current = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (looksLikeBullet(line)) {
      // Standalone bullet — push as title-only item.
      out.push({ [titleKey]: stripBullet(line), [textKey]: "" });
      current = null;
      continue;
    }
    // Heuristic: short lines (<80 chars) = title; longer = body.
    if (trimmed.length < 80 && !current) {
      current = { [titleKey]: trimmed, [textKey]: "" };
      out.push(current);
    } else if (current && !current[textKey]) {
      current[textKey] = trimmed;
    } else {
      current = { [titleKey]: trimmed, [textKey]: "" };
      out.push(current);
    }
  }
  return out.slice(0, 10);
}

function parseLanguages(lines) {
  // Languages are usually "English — Native", "Spanish (Advanced)", etc.
  const out = [];
  const joined = lines.join("\n");
  const parts = joined.split(/[•·,;|\n]/).map((s) => s.trim()).filter(Boolean);
  for (const p of parts) {
    // Match "Name — Level" / "Name - Level" / "Name (Level)" / "Name: Level"
    let m = p.match(/^([A-Za-z][\w\s]+?)\s*[-–—:(\\]+\s*([\w\s]+?)[)\s]*$/);
    if (m) {
      out.push({ name: m[1].trim(), level: m[2].trim() });
    } else if (p.length < 40) {
      // Single token language; level unknown.
      out.push({ name: p, level: "" });
    }
  }
  return out.slice(0, 8);
}

// ---------------------------------------------------------------------------
// 5. Public API
// ---------------------------------------------------------------------------

export function parseCvText(rawText) {
  // Normalise line endings, drop weird artefacts.
  const text = rawText.replace(/\r\n/g, "\n").replace(/\f/g, "\n");
  const lines = text.split("\n");

  // Header parsing uses the first ~30 lines for name/contact detection.
  const headerArea = lines.slice(0, 30);
  const name = extractName(headerArea);
  const contact = extractContact(text);
  const role = extractRole(lines, name);

  const { sections } = splitSections(lines);

  const data = {
    name: name || "",
    role: role || "",
    phone: contact.phone || "",
    email: contact.email || "",
    linkedin: contact.linkedin || "",
    location: contact.location || "",
    photo: "",
    summary: sections.summary ? parseSummary(sections.summary) : "",
    experience: sections.experience ? parseExperience(sections.experience) : [],
    education: sections.education ? parseEducation(sections.education) : [],
    achievements: sections.achievements
      ? parseTitledItems(sections.achievements, "title", "text")
      : [],
    skills: sections.skills ? parseSkills(sections.skills) : [],
    courses: sections.courses
      ? parseTitledItems(sections.courses, "title", "text")
      : [],
    languages: sections.languages ? parseLanguages(sections.languages) : [],
  };

  // Build a list of fields we couldn't fill — frontend can show "review these".
  const missing = [];
  if (!data.name) missing.push("name");
  if (!data.email) missing.push("email");
  if (!data.phone) missing.push("phone");
  if (!data.summary) missing.push("summary");
  if (data.experience.length === 0) missing.push("experience");
  if (data.education.length === 0) missing.push("education");
  if (data.skills.length === 0) missing.push("skills");

  return { data, missing };
}
