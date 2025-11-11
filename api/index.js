export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "✅ Zoho PDF uploader server is running fine on Vercel!",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}
