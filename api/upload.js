import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Required for FormData uploads
  },
};

export default async function handler(req, res) {
  try {
    // Ensure /public exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

    // ─────────────────────────────────────────────
    // CASE 1: Multipart upload (Zoho sends File)
    // ─────────────────────────────────────────────
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return res.status(400).json({ success: false, error: err.message });
        }

        const file = files.file?.[0] || files.file;
        const fileName = fields.fileName?.[0] || "zoho_file.pdf";
        const target = path.join(publicDir, fileName);

        // Move uploaded file into /public
        fs.renameSync(file.filepath, target);

        const publicUrl = `https://${req.headers.host}/${fileName}`;
        return res.status(200).json({ success: true, url: publicUrl });
      });
      return;
    }

    // ─────────────────────────────────────────────
    // CASE 2: JSON body (Zoho sends Base64)
    // ─────────────────────────────────────────────
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const data = JSON.parse(raw || "{}");

    if (!data.fileContent) {
      return res.status(400).json({ success: false, error: "No file data." });
    }

    const fileName = data.fileName || `zoho_${Date.now()}.pdf`;
    const buffer = Buffer.from(data.fileContent, "base64");
    const filePath = path.join(publicDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `https://${req.headers.host}/${fileName}`;
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
