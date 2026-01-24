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
const corsOptions = {
  origin: [
    "https://jpd-hub-hackathon.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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

