const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");

// Load env
dotenv.config();

// Init app FIRST
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));

app.use(helmet());

// Logs
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limit
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
}));

// Routes
const resumeRoutes = require("./routes/resumes");
const jobMatchRoutes = require("./routes/jobMatch");
const aiRoutes = require("./routes/ai");

app.use("/api/resumes", resumeRoutes);
app.use("/api/job-match", jobMatchRoutes);
app.use("/api/ai", aiRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Health
app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success:false, message:"Route not found" });
});

module.exports = app;
