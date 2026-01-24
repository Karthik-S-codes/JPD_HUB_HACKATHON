const User = require('../models/User');

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - Clean, lowercase slug with hyphens
 * 
 * Examples:
 * "Anika Sharma" → "anika-sharma"
 * "John's Hub!" → "johns-hub"
 * "User_Name#123" → "user-name-123"
 */
const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  return text
    .toLowerCase()                      // Convert to lowercase
    .trim()                             // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '')          // Remove special characters (keep letters, numbers, spaces, hyphens)
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/-+/g, '-')               // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');          // Remove leading/trailing hyphens
};

/**
 * Check if a slug already exists in the database
 * @param {string} slug - The slug to check
 * @returns {Promise<boolean>} - True if slug exists, false otherwise
 */
const slugExists = async (slug) => {
  const existingUser = await User.findOne({ hubSlug: slug });
  return !!existingUser;
};

/**
 * Generate a unique slug by appending a number if necessary
 * @param {string} baseText - The original text to convert to slug
 * @param {string} [userId] - Optional user ID to exclude from uniqueness check (for updates)
 * @returns {Promise<string>} - A unique slug
 * 
 * Examples:
 * If "anika-sharma" exists:
 *   → "anika-sharma-1"
 * If "anika-sharma-1" also exists:
 *   → "anika-sharma-2"
 */
const generateUniqueSlug = async (baseText, userId = null) => {
  const baseSlug = generateSlug(baseText);
  
  if (!baseSlug) {
    throw new Error('Unable to generate slug from provided text');
  }

  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    // Check if slug exists
    const query = { hubSlug: slug };
    
    // If updating existing user, exclude their own slug from the check
    if (userId) {
      query._id = { $ne: userId };
    }

    const existingUser = await User.findOne(query);
    
    if (!existingUser) {
      isUnique = true;
    } else {
      // Append counter and try again
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
};

/**
 * Validate a slug format
 * @param {string} slug - The slug to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidSlug = (slug) => {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  // Should be at least 1 character long
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

module.exports = {
  generateSlug,
  slugExists,
  generateUniqueSlug,
  isValidSlug
};
