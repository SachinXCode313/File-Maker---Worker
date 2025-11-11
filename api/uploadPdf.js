import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/uploadPdf
router.post("/uploadPdf", async (req, res) => {
  try {
    const { fileName, fileContent } = req.body;

    if (!fileName || !fileContent) {
      return res.status(400).json({ error: "Missing fileName or fileContent" });
    }

    // Decode base64 content into a binary buffer
    const buffer = Buffer.from(fileContent, "base64");

    // Ensure uploads folder exists
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Write decoded PDF file
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Generate public URL for the saved PDF
    const publicUrl = `${req.protocol}://${req.get("host")}/public/${fileName}`;

    console.log(`✅ PDF saved: ${filePath}`);
    res.status(200).json({
      success: true,
      message: "PDF generated successfully",
      publicUrl,
    });
  } catch (err) {
    console.error("❌ Error saving PDF:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
