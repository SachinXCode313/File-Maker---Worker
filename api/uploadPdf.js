import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/uploadPdf", async (req, res) => {
  try {
    const { fileName, fileContent } = req.body;

    if (!fileName || !fileContent) {
      return res.status(400).json({ error: "Missing fileName or fileContent" });
    }

    // Decode Base64 → Buffer
    const buffer = Buffer.from(fileContent, "base64");

    // Save file in Vercel temporary dir
    const tmpPath = path.join("/tmp", fileName);
    fs.writeFileSync(tmpPath, buffer);

    // Generate public URL
    const publicUrl = `${req.protocol}://${req.get("host")}/public/${fileName}`;

    console.log(`✅ PDF temporarily saved: ${tmpPath}`);
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
