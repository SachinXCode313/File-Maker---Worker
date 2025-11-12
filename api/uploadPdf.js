import express from "express";
import { put } from "@vercel/blob";
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();

router.post("/uploadPdf", async (req, res) => {
  try {
    const { fileName, fileContent } = req.body;
    if (!fileName || !fileContent) {
      return res.status(400).json({ error: "Missing fileName or fileContent" });
    }

    // Create a unique file name to avoid collisions
    // const uniqueName = `${crypto.randomUUID()}_${fileName}`;

    // Convert Base64 → Buffer
    const buffer = Buffer.from(fileContent, "base64");

    // Upload to Vercel Blob with TTL
    const { url } = await put(`orders/${fileName}`, buffer, {
      access: "public",       // makes file publicly accessible
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
      addRandomSuffix: false, // file name stays as given (optional)
      contentType: "application/pdf",
      cacheControlMaxAge: 0,
      // Optional TTL (e.g., 15 minutes)
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    console.log(`✅ Uploaded PDF: ${url}`);
    res.status(200).json({
      success: true,
      message: "PDF uploaded to Blob successfully",
      publicUrl: url,
    });
  } catch (err) {
    console.error("❌ Error uploading to Blob:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
