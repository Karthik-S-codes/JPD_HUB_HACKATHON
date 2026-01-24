require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import rate limiting middleware for scalability
const {
  publicLimiter,
  authLimiter,
  userLimiter,
  clickLimiter,
  stopCleanup
} = require("./middleware/rateLimiter");

// Import geolocation middleware
const { geoLocationMiddleware } = require("./middleware/geoLocation");

// Import device detection middleware
const { deviceDetectionMiddleware } = require("./middleware/deviceDetection");

const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// CORS configuration for frontend (allow localhost + configured Vercel URL)
const allowedOrigins = new Set([
  process.env.FRONTEND_URL || "https://jpd-hub-hackathon.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
]);
const vercelPreviewRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin or server-to-server

    const isAllowed =
      allowedOrigins.has(origin) ||
      vercelPreviewRegex.test(origin);

    if (isAllowed) return callback(null, true);

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(express.json());

connectDB();

// Apply geolocation middleware to all requests
app.use(geoLocationMiddleware);

// Apply device detection middleware to all requests
app.use(deviceDetectionMiddleware);

// Apply rate limiting middleware
// Auth endpoints (login, signup) - strict limits to prevent brute force
app.use("/auth", authLimiter);

// Public endpoints - moderate limits
app.use("/public", publicLimiter);

// Click tracking - high limits for tracking
app.use("/click", clickLimiter);

// User API endpoints - moderate limits
app.use("/analytics", userLimiter);

app.use(authRoutes);
app.use(linkRoutes);
app.use("/user", userRoutes);

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log("Server running on port " + port)
);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  stopCleanup();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

