import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import uploadPdfRouter from "./api/uploadPdf.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow all origins — can restrict to specific frontend if needed

// Static folder for serving files publicly
app.use("/public", express.static(path.join(__dirname, "uploads")));

// Root endpoint — health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running fine ✅" });
});

// Routes
app.use("/api", uploadPdfRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
