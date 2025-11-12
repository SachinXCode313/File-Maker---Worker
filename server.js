import express from "express";
import cors from "cors";
import uploadPdfRouter from "./api/uploadPdf.js";
import path from "path";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Static serving for PDFs (tmp folder)
// app.use("/public", express.static("/tmp"));

// API routes
app.use("/api", uploadPdfRouter);

// Root endpoint (for testing)
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running ✅" });
});

// Start server (local dev)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

export default app; // for vercel
