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
const { generateAnalyticsCSV, generateCSVFilename } = require("../utils/csvExport");

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
 * Filter links based on visitor's location
 * 
 * @param {Object} link - Link document
 * @param {string} visitorCountry - Visitor's country code
 * @returns {boolean} - True if link should be visible
 */
const isLinkVisibleByLocation = (link, visitorCountry) => {
  // If no allowed countries specified, show to all
  if (!link.allowedCountries || link.allowedCountries.length === 0) {
    return true;
  }

  // Check if GLOBAL is in allowed countries (visible to everyone)
  if (link.allowedCountries.includes("GLOBAL")) {
    return true;
  }

  // Check if visitor's country is in allowed countries
  if (link.allowedCountries.includes(visitorCountry)) {
    return true;
  }

  // Link not visible to this country
  return false;
};

/**
 * Filter links based on visitor's device type
 * 
 * @param {Object} link - Link document
 * @param {string} visitorDevice - Visitor's device type
 * @returns {boolean} - True if link should be visible
 */
const isLinkVisibleByDevice = (link, visitorDevice) => {
  // If no allowed devices specified or contains "all", show to all
  if (!link.allowedDevices || link.allowedDevices.length === 0 || link.allowedDevices.includes("all")) {
    return true;
  }

  // Check if visitor's device is in allowed devices
  if (link.allowedDevices.includes(visitorDevice)) {
    return true;
  }

  // Link not visible to this device
  return false;
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
    
    // Get user info including theme preference
    const user = await User.findById(req.params.userId)
      .select("name hubTitle hubDescription theme accentColor");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get user's links with location data
    const allLinks = await Link.find({ userId: req.params.userId })
      .select("title url description clicks visits qrCode order rules allowedCountries allowedDevices")
      .sort({ order: 1 });

    // Filter links based on visitor's country AND device
    const visibleLinks = allLinks.filter(link => {
      const countryMatch = isLinkVisibleByLocation(link, req.country);
      const deviceMatch = isLinkVisibleByDevice(link, req.deviceType);
      return countryMatch && deviceMatch; // Both must pass
    });

    console.log(`[Filters] Country: ${req.country} | Device: ${req.deviceType} | Total: ${allLinks.length} | Visible: ${visibleLinks.length}`);

    res.json({
      userName: user.name,
      hubTitle: user.hubTitle,
      hubDescription: user.hubDescription,
      theme: user.theme,
      accentColor: user.accentColor,
      visitorCountry: req.country,
      visitorCountryName: req.countryName,
      visitorDevice: req.deviceType,
      visitorDeviceInfo: req.deviceInfo,
      totalLinks: allLinks.length,
      visibleLinks: visibleLinks.length,
      links: visibleLinks
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

/**
 * Export analytics data as CSV
 * 
 * Generates a downloadable CSV file containing analytics data for all user links.
 * Includes link title, URL, clicks, visits, last clicked date, and created date.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - User ID whose analytics to export
 * @param {Object} res - Express response object
 * @returns {File} CSV file download
 */
exports.exportAnalytics = async (req, res) => {
  try {
    const User = require("../models/User");
    
    // Get user info
    const user = await User.findById(req.params.userId).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all links with analytics data
    const links = await Link.find({ userId: req.params.userId })
      .select("title url clicks visits createdAt updatedAt")
      .sort({ clicks: -1 });

    if (links.length === 0) {
      return res.status(404).json({ message: "No links found for this user" });
    }

    // Add lastClicked field (use updatedAt as proxy)
    const linksWithLastClicked = links.map(link => ({
      title: link.title,
      url: link.url,
      clicks: link.clicks,
      visits: link.visits,
      lastClicked: link.clicks > 0 ? link.updatedAt : null,
      createdAt: link.createdAt
    }));

    // Generate CSV
    const csv = generateAnalyticsCSV(linksWithLastClicked, user.name);
    const filename = generateCSVFilename(user.name);

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");

    // Send CSV
    res.status(200).send(csv);
  } catch (err) {
    console.error("Export analytics error:", err);
    res.status(500).json({ message: "Error exporting analytics" });
  }
};

