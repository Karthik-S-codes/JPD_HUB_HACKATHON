/**
 * User Routes
 * 
 * Handles user profile management endpoints:
 * - GET /user/profile - Get current user profile
 * - PUT /user/profile - Update profile (name, hub title, description)
 * - PUT /user/theme - Update theme preference (light/dark)
 * - PUT /user/accent-color - Update accent color
 */

const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  updateTheme,
  updateAccentColor
} = require("../controllers/userController");

const router = express.Router();

// All routes require authentication
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/theme", auth, updateTheme);
router.put("/accent-color", auth, updateAccentColor);

module.exports = router;
