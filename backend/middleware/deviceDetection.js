/**
 * Device Detection Middleware
 * 
 * Detects visitor's device type using User-Agent header.
 * Uses ua-parser-js library for accurate device detection.
 * 
 * Adds to request:
 * - req.deviceType: "mobile", "desktop", or "tablet"
 * - req.deviceInfo: Full device information (browser, OS, etc.)
 */

const UAParser = require('ua-parser-js');

/**
 * Parse User-Agent and determine device type
 * @param {string} userAgent - User-Agent string from request headers
 * @returns {Object} Device information with type and details
 */
const parseDevice = (userAgent) => {
  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    // Determine device type from parsed data
    let deviceType = 'desktop'; // Default
    
    if (result.device.type === 'mobile') {
      deviceType = 'mobile';
    } else if (result.device.type === 'tablet') {
      deviceType = 'tablet';
    } else if (result.device.type === 'wearable' || result.device.type === 'smarttv') {
      deviceType = 'mobile'; // Treat as mobile for simplicity
    } else {
      // Check OS for mobile indicators if device type is undefined
      const mobileOS = ['Android', 'iOS', 'Windows Phone', 'BlackBerry'];
      if (mobileOS.includes(result.os.name)) {
        deviceType = 'mobile';
      }
    }
    
    return {
      deviceType,
      browser: result.browser.name || 'Unknown',
      browserVersion: result.browser.version || 'Unknown',
      os: result.os.name || 'Unknown',
      osVersion: result.os.version || 'Unknown',
      device: result.device.model || result.device.vendor || 'Unknown',
      success: true
    };
  } catch (err) {
    console.error('Device parsing error:', err.message);
    return {
      deviceType: 'desktop', // Fallback to desktop
      success: false,
      error: err.message
    };
  }
};

/**
 * Middleware to detect device and attach to request
 * Includes fallback to desktop if detection fails
 */
const deviceDetectionMiddleware = (req, res, next) => {
  try {
    // Extract User-Agent from headers
    const userAgent = req.headers['user-agent'] || '';
    
    // Parse device information
    const deviceInfo = parseDevice(userAgent);
    
    // Attach to request
    req.deviceType = deviceInfo.deviceType;
    req.deviceInfo = deviceInfo;
    
    console.log(`[Device] ${req.clientIP || req.ip} → ${req.deviceType} | ${deviceInfo.browser} on ${deviceInfo.os}`);
    
    next();
  } catch (err) {
    console.error('Device detection middleware error:', err);
    
    // Fallback to desktop if error
    req.deviceType = 'desktop';
    req.deviceInfo = { deviceType: 'desktop', success: false };
    
    next();
  }
};

module.exports = {
  deviceDetectionMiddleware,
  parseDevice
};
