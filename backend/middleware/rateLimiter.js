/**
 * Rate Limiting Middleware for API Requests
 * 
 * This middleware implements rate limiting to prevent abuse and ensure
 * scalability by controlling the number of requests a client can make
 * within a specific time window.
 * 
 * Features:
 * - IP-based tracking for public endpoints
 * - Token-based tracking for authenticated endpoints
 * - Different rate limits for different endpoint types
 * - Exponential backoff support for retry-after headers
 * - In-memory storage (can be extended to Redis for distributed systems)
 */

// Store for tracking request counts
// In production, use Redis for distributed rate limiting
const requestCounts = new Map();

/**
 * Clean up old entries to prevent memory leak
 * Runs every 5 minutes to remove entries older than the window
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  const maxAge = 15 * 60 * 1000; // 15 minutes
  
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.firstRequest > maxAge) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * General purpose rate limiter
 * @param {number} maxRequests - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} keyGenerator - Function to generate rate limit key
 * @returns {Function} Middleware function
 */
const createRateLimiter = (maxRequests, windowMs, keyGenerator) => {
  return (req, res, next) => {
    // Generate a unique key for this client
    const key = keyGenerator(req);
    
    const now = Date.now();
    const requestData = requestCounts.get(key);
    
    // If no previous requests or window has expired
    if (!requestData || now - requestData.firstRequest > windowMs) {
      requestCounts.set(key, {
        count: 1,
        firstRequest: now,
        resetTime: now + windowMs
      });
      
      // Set rate limit headers
      res.set('X-RateLimit-Limit', maxRequests);
      res.set('X-RateLimit-Remaining', maxRequests - 1);
      res.set('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
      
      return next();
    }
    
    // Increment request count
    requestData.count++;
    const remaining = Math.max(0, maxRequests - requestData.count);
    
    // Set rate limit headers
    res.set('X-RateLimit-Limit', maxRequests);
    res.set('X-RateLimit-Remaining', remaining);
    res.set('X-RateLimit-Reset', new Date(requestData.resetTime).toISOString());
    
    // Check if limit exceeded
    if (requestData.count > maxRequests) {
      const retryAfter = Math.ceil((requestData.resetTime - now) / 1000);
      res.set('Retry-After', retryAfter);
      
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter: retryAfter
      });
    }
    
    next();
  };
};

/**
 * Middleware for public endpoints (e.g., public link viewing)
 * Limit: 100 requests per 15 minutes per IP
 */
const publicLimiter = createRateLimiter(
  100,
  15 * 60 * 1000,
  (req) => req.ip || req.connection.remoteAddress || 'unknown'
);

/**
 * Middleware for authentication endpoints (login, signup)
 * Limit: 10 requests per 15 minutes per IP (strict to prevent brute force)
 */
const authLimiter = createRateLimiter(
  10,
  15 * 60 * 1000,
  (req) => req.ip || req.connection.remoteAddress || 'unknown'
);

/**
 * Middleware for user API endpoints (link creation, analytics)
 * Limit: 50 requests per 5 minutes per user (authenticated)
 */
const userLimiter = createRateLimiter(
  50,
  5 * 60 * 1000,
  (req) => {
    // Use user ID from token or fallback to IP
    return req.userId || req.ip || req.connection.remoteAddress || 'unknown';
  }
);

/**
 * Middleware for click tracking endpoints
 * Limit: 1000 requests per 5 minutes per IP (high limit for tracking)
 */
const clickLimiter = createRateLimiter(
  1000,
  5 * 60 * 1000,
  (req) => req.ip || req.connection.remoteAddress || 'unknown'
);

/**
 * Cleanup function to stop the interval when server shuts down
 */
const stopCleanup = () => {
  clearInterval(cleanupInterval);
};

module.exports = {
  publicLimiter,
  authLimiter,
  userLimiter,
  clickLimiter,
  createRateLimiter,
  stopCleanup
};
