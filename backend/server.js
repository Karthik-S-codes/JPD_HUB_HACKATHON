require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const {
  publicLimiter,
  authLimiter,
  userLimiter,
  clickLimiter,
  stopCleanup
} = require("./middleware/rateLimiter");

const { geoLocationMiddleware } = require("./middleware/geoLocation");
const { deviceDetectionMiddleware } = require("./middleware/deviceDetection");

const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ---- CORS setup (single, robust) ----
const normalize = (url) => (url ? url.replace(/\/+$/, "") : url);

const allowedOrigins = new Set([
  normalize(process.env.FRONTEND_URL || "https://jpd-hub-hackathon.vercel.app"),
  "http://localhost:5173",
  "http://localhost:3000"
]);
const vercelPreviewRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ensure preflight succeeds

app.use(express.json());

// ---- DB & middlewares ----
connectDB();
app.use(geoLocationMiddleware);
app.use(deviceDetectionMiddleware);

// ---- Rate limiters ----
app.use("/public", publicLimiter);
app.use("/click", clickLimiter);
app.use("/analytics", userLimiter);

// ---- Routes ----
app.use(authRoutes);
app.use(linkRoutes);
app.use("/user", userRoutes);

// Optional health route (handy for Render checks)
app.get("/", (req, res) => {
  res.json({ ok: true, service: "JPD Hub API", env: process.env.NODE_ENV || "production" });
});

// ---- Server & shutdown ----
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log("Server running on port " + port);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  stopCleanup();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

