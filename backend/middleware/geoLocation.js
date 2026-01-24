/**
 * Geolocation Middleware
 * 
 * Detects visitor's country using their IP address.
 * Uses free ip-api.com service for IP geolocation.
 * 
 * Adds to request:
 * - req.clientIP: Client's IP address
 * - req.country: Country code (e.g., "IN", "US", "GB")
 * - req.countryName: Full country name
 * - req.locationData: Full geolocation response
 */

const axios = require("axios");

/**
 * Fetch geolocation data from IP address
 * @param {string} ip - IP address to lookup
 * @returns {Promise<Object>} Location data with country code and name
 */
const getLocationFromIP = async (ip) => {
  try {
    // Use ip-api.com free tier (45 requests per minute limit)
    const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,countryCode,country,city,region`, {
      timeout: 5000
    });
    
    if (response.data.status === "success") {
      return {
        country: response.data.countryCode || "UNKNOWN",
        countryName: response.data.country || "Unknown",
        city: response.data.city || "Unknown",
        region: response.data.region || "Unknown",
        success: true
      };
    }
    
    return {
      country: "UNKNOWN",
      countryName: "Unknown",
      success: false,
      error: "Geolocation lookup failed"
    };
  } catch (err) {
    console.error("Geolocation API error:", err.message);
    return {
      country: "UNKNOWN",
      countryName: "Unknown",
      success: false,
      error: err.message
    };
  }
};

/**
 * Middleware to extract IP and attach geolocation to request
 * Includes fallback to GLOBAL if location lookup fails
 */
const geoLocationMiddleware = async (req, res, next) => {
  try {
    // Extract client IP from various sources
    const clientIP = 
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    // Attach IP to request
    req.clientIP = clientIP;

    // Skip geolocation for localhost
    if (clientIP === "127.0.0.1" || clientIP === "::1") {
      req.country = "IN"; // Default to India for testing
      req.countryName = "India";
      req.locationData = { country: "IN", countryName: "India", success: true };
      return next();
    }

    // Fetch geolocation data
    const locationData = await getLocationFromIP(clientIP);
    
    req.country = locationData.country;
    req.countryName = locationData.countryName;
    req.locationData = locationData;

    console.log(`[Geo] IP: ${clientIP} → Country: ${req.country}`);

    next();
  } catch (err) {
    console.error("Geolocation middleware error:", err);
    
    // Fallback to GLOBAL if error
    req.country = "UNKNOWN";
    req.countryName = "Unknown";
    req.locationData = { success: false };
    
    next();
  }
};

module.exports = {
  geoLocationMiddleware,
  getLocationFromIP
};
