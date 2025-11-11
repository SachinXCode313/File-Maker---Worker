import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import uploadPdfRouter from "./api/uploadPdf.js";

dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder for public files
app.use("/public", express.static(path.join(__dirname, "uploads")));

// Test endpoint ✅
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running fine ✅" });
});

// PDF Upload API
app.use("/api", uploadPdfRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
