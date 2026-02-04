const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");

// Load env vars
dotenv.config();

// Connect DB (safe for Vercel)
connectDB();

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resumes");
const jobMatchRoutes = require("./routes/jobMatch");
const aiRoutes = require("./routes/ai");

const app = express();

// Parsers

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type"]
}));


// Security
app.use(helmet());

// Logs
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/job-match", jobMatchRoutes);
app.use("/api/ai", aiRoutes);

// Root test (IMPORTANT for Vercel)
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Health
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer API running",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🚨 DO NOT LISTEN ON PORT FOR VERCEL
module.exports = app;
