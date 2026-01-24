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

// CORS configuration for frontend
const corsOptions = {
  origin: [
    "https://smart-links-eta.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
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

const server = app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
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

