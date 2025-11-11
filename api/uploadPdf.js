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
    console.log(req.body)
    if (!fileName || !fileContent) {
      return res.status(400).json({ error: "Missing fileName or fileContent" });
    }

    const buffer = Buffer.from(fileContent, "fileContent");
    const uploadsDir = path.join(__dirname, "../uploads");

    // Ensure folder exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `${req.protocol}://${req.get("host")}/public/${fileName}`;
    res.status(200).json({ success: true, publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
