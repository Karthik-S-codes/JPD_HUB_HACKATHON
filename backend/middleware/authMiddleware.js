/**
 * Authentication Middleware
 * 
 * Validates JWT tokens for protected routes.
 * Extracts user information from token and attaches to request object.
 * 
 * Usage: Apply to routes that require authentication
 * Example: app.use('/protected-route', authMiddleware, controller.handler)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.headers.authorization - JWT token from client
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if valid, sends 401 if invalid
 * 
 * Token Format: Raw JWT string in authorization header
 * Expected Header: authorization: <jwt_token>
 */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extract token from authorization header
  const token = req.headers.authorization;
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided. Authentication required." 
    });
  }

  try {
    // Verify and decode JWT token using secret
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user ID to request for use in route handlers
    req.userId = req.user.id;
    
    // Proceed to next middleware/handler
    next();
  } catch (err) {
    // Handle token verification errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token has expired" 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};
