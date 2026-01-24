/**
 * User Controller
 * 
 * Manages user profile operations including:
 * - Profile updates (name, hub title, hub description)
 * - Theme preferences (light/dark mode)
 * - Accent color customization
 */

const User = require("../models/User");

/**
 * Get user profile information
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} User profile data
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

/**
 * Update user profile
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's name
 * @param {string} req.body.hubTitle - Hub page title
 * @param {string} req.body.hubDescription - Hub page description
 * @param {Object} res - Express response object
 * @returns {Object} Updated user data
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, hubTitle, hubDescription } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (hubTitle) updateData.hubTitle = hubTitle;
    if (hubDescription !== undefined) updateData.hubDescription = hubDescription;
    updateData.updatedAt = Date.now();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

/**
 * Update theme preference
 * 
 * Allows users to switch between light and dark themes.
 * Theme is applied to their public hub page.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.theme - Theme choice ("light" or "dark")
 * @param {Object} res - Express response object
 * @returns {Object} Updated theme preference
 */
exports.updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    // Validate theme value
    if (!theme || !["light", "dark"].includes(theme)) {
      return res.status(400).json({ 
        message: "Invalid theme. Must be 'light' or 'dark'" 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { theme, updatedAt: Date.now() },
      { new: true }
    ).select("theme");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Theme updated successfully", 
      theme: user.theme 
    });
  } catch (err) {
    console.error("Update theme error:", err);
    res.status(500).json({ message: "Error updating theme" });
  }
};

/**
 * Update accent color
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.accentColor - Hex color code
 * @param {Object} res - Express response object
 * @returns {Object} Updated accent color
 */
exports.updateAccentColor = async (req, res) => {
  try {
    const { accentColor } = req.body;

    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!accentColor || !hexColorRegex.test(accentColor)) {
      return res.status(400).json({ 
        message: "Invalid color. Must be a valid hex color (e.g., #00ff00)" 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { accentColor, updatedAt: Date.now() },
      { new: true }
    ).select("accentColor");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Accent color updated successfully", 
      accentColor: user.accentColor 
    });
  } catch (err) {
    console.error("Update accent color error:", err);
    res.status(500).json({ message: "Error updating accent color" });
  }
};
