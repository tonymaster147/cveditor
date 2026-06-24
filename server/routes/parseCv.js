import { Router } from "express";
import multer from "multer";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { parseCvText } from "../cvParser.js";

const router = Router();

// 5 MB cap. Real CVs are usually <500 KB; anything larger is probably
// images or a scan and won't parse well anyway.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// pdf-parse v2 is class-based: `new PDFParse({ data }).getText()`.
async function extractPdfText(buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    // `getText()` returns { text: string, ... } or similar — be defensive.
    return result?.text ?? (typeof result === "string" ? result : "");
  } finally {
    await parser.destroy();
  }
}

router.post("/parse-cv", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const { mimetype, originalname, buffer } = req.file;
  const lowerName = (originalname || "").toLowerCase();

  let rawText = "";
  try {
    if (mimetype === "application/pdf" || lowerName.endsWith(".pdf")) {
      rawText = await extractPdfText(buffer);
    } else if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerName.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || "";
    } else {
      return res.status(415).json({
        error: "Unsupported file type. Please upload a PDF or DOCX.",
      });
    }
  } catch (err) {
    console.error("CV extraction failed:", err);
    return res.status(422).json({
      error: "Couldn't read that file. It may be scanned, password-protected, or corrupt.",
    });
  }

  if (!rawText || rawText.trim().length < 30) {
    return res.status(422).json({
      error: "Couldn't find any readable text in the file. If it's a scanned PDF, try a text-based one.",
    });
  }

  const parsed = parseCvText(rawText);

  res.json({
    ok: true,
    data: parsed.data,
    missing: parsed.missing,
    debug: {
      rawTextLength: rawText.length,
      filename: originalname,
    },
  });
});

export default router;
