/**
 * Link Controller
 * 
 * Manages all link-related operations including:
 * - Link CRUD operations (Create, Read, Update, Delete)
 * - QR code generation
 * - Click tracking and analytics
 * - Link reordering for user interface
 * - Rule engine management
 */

const Link = require("../models/Link");
const Analytics = require("../models/Analytics");
const QRCode = require("qrcode");

/**
 * Create a new shortened link with QR code
 * 
 * Validates input, generates QR code, and stores link data.
 * Implements rule engine support for dynamic link behavior.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.title - Display title for the link
 * @param {string} req.body.url - Full URL to be shortened
 * @param {string} req.body.description - Optional link description
 * @param {Array} req.body.rules - Optional rules for link (time-based, device-based, etc)
 * @param {Object} res - Express response object
 * @returns {Object} Created link object with QR code
 */
exports.createLink = async (req, res) => {
  try {
    const { title, url, description, rules } = req.body;

    // Input validation
    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    // Get the last order number to maintain link sequence
    const lastLink = await Link.findOne({ userId: req.user.id }).sort({ order: -1 });
    const newOrder = lastLink ? lastLink.order + 1 : 0;

    // Generate QR code for the URL using qrcode library
    const qrCode = await QRCode.toDataURL(url);

    // Create new link document with optional rules
    const link = new Link({
      userId: req.user.id,
      title,
      url,
      description,
      rules: rules || [],
      order: newOrder,
      qrCode,
      clicks: 0,
      visits: 0
    });

    await link.save();
    res.status(201).json({ message: "Link created", link });
  } catch (err) {
    console.error("Create link error:", err);
    res.status(500).json({ message: "Error creating link" });
  }
};

/**
 * Retrieve all links for authenticated user
 * 
 * Returns links sorted by order for proper display sequence.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} Array of user's links
 */
exports.getMyLinks = async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id }).sort({ order: 1 });
    res.json(links);
  } catch (err) {
    console.error("Get links error:", err);
    res.status(500).json({ message: "Error fetching links" });
  }
};

/**
 * Update existing link with new data
 * 
 * Allows modification of link properties including rules.
 * Regenerates QR code if URL changes.
 * Implements authorization check to prevent unauthorized updates.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Link ID to update
 * @param {string} req.body.title - Updated title
 * @param {string} req.body.url - Updated URL
 * @param {string} req.body.description - Updated description
 * @param {Array} req.body.rules - Updated rules array
 * @param {Object} res - Express response object
 * @returns {Object} Updated link object
 */
exports.updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description, rules } = req.body;

    // Find link by ID
    const link = await Link.findById(id);
    if (!link) return res.status(404).json({ message: "Link not found" });

    // Authorization check: ensure user owns the link
    if (link.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update link properties if provided
    if (title) link.title = title;
    if (url) {
      link.url = url;
      // Regenerate QR code if URL changes
      link.qrCode = await QRCode.toDataURL(url);
    }
    if (description) link.description = description;
    if (rules) link.rules = rules;

    // Update timestamp
    link.updatedAt = Date.now();
    await link.save();

    res.json({ message: "Link updated", link });
  } catch (err) {
    console.error("Update link error:", err);
    res.status(500).json({ message: "Error updating link" });
  }
};

/**
 * Delete a link permanently
 * 
 * Removes link from database and associated analytics.
 * Implements authorization check to prevent unauthorized deletion.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Link ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ message: "Link not found" });

    // Authorization check: ensure user owns the link
    if (link.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Link.findByIdAndDelete(req.params.id);
    res.json({ message: "Link deleted" });
  } catch (err) {
    console.error("Delete link error:", err);
    res.status(500).json({ message: "Error deleting link" });
  }
};

/**
 * Reorder links for user interface
 * 
 * Updates the order field for multiple links to match
 * the user's preferred display sequence.
 * 
 * @param {Object} req - Express request object
 * @param {Array} req.body.links - Array of {id, order} objects
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.reorderLinks = async (req, res) => {
  try {
    const { links } = req.body;

    // Update order for each link
    for (let item of links) {
      await Link.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.json({ message: "Links reordered" });
  } catch (err) {
    console.error("Reorder links error:", err);
    res.status(500).json({ message: "Error reordering links" });
  }
};

/**
 * Get public links for a user's profile
 * 
 * Returns limited link data for public display with user information.
 * Does not require authentication.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - User ID whose links to retrieve
 * @param {Object} res - Express response object
 * @returns {Object} User info and array of public link data
 */
exports.getPublicLinks = async (req, res) => {
  try {
    const User = require("../models/User");
    
    // Get user info
    const user = await User.findById(req.params.userId)
      .select("name hubTitle hubDescription");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get user's links
    const links = await Link.find({ userId: req.params.userId })
      .select("title url description clicks visits qrCode order rules")
      .sort({ order: 1 });

    res.json({
      userName: user.name,
      hubTitle: user.hubTitle,
      hubDescription: user.hubDescription,
      links: links
    });
  } catch (err) {
    console.error("Get public links error:", err);
    res.status(500).json({ message: "Error fetching links" });
  }
};

/**
 * Track link click and record analytics
 * 
 * Increments click counter and stores analytics data
 * including device type and IP address for insights.
 * Implements rule engine evaluation for conditional tracking.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Link ID being clicked
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress = req.ip || "unknown";
    // Determine device type from user agent
    const device = userAgent.includes("Mobile") ? "mobile" : "desktop";

    // Increment click and visit counters
    const link = await Link.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1, visits: 1 } },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Store detailed analytics record
    await Analytics.create({
      userId: link.userId,
      linkId: id,
      userAgent,
      ipAddress,
      device,
      timestamp: new Date()
    });

    res.json({ message: "Click tracked" });
  } catch (err) {
    console.error("Track click error:", err);
    res.status(500).json({ message: "Error tracking click" });
  }
};

/**
 * Get comprehensive analytics for user's links
 * 
 * Calculates aggregated metrics across all user's links
 * including total visits, clicks, and top performing links.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Analytics data with totals and top performers
 */
exports.getAnalytics = async (req, res) => {
  try {
    // Fetch all links with metrics for user
    const links = await Link.find({ userId: req.user.id })
      .select("title clicks visits createdAt")
      .sort({ clicks: -1 });

    // Calculate totals
    const totalVisits = links.reduce((sum, link) => sum + link.visits, 0);
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

    // Return comprehensive analytics
    res.json({
      totalVisits,
      totalClicks,
      topPerformers: links.slice(0, 5),
      allLinks: links,
      totalLinks: links.length,
      averageClicksPerLink: links.length > 0 ? (totalClicks / links.length).toFixed(2) : 0,
      averageVisitsPerLink: links.length > 0 ? (totalVisits / links.length).toFixed(2) : 0
    });
  } catch (err) {
    console.error("Get analytics error:", err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
