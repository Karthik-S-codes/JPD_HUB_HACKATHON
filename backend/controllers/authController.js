/**
 * Authentication Controller
 * 
 * Handles user authentication operations including:
 * - User registration (signup)
 * - User login
 * - JWT token generation
 * 
 * Security Features:
 * - Password hashing using bcryptjs
 * - JWT authentication for sessions
 * - Input validation
 * - Duplicate email prevention
 */

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * User Signup Handler
 * 
 * Creates a new user account with validated credentials.
 * Implements security measures to prevent duplicate accounts.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address (unique)
 * @param {string} req.body.password - User's password (hashed before storage)
 * @param {Object} res - Express response object
 * @returns {Object} Success message or error
 * 
 * Status Codes:
 * - 201: User created successfully
 * - 400: Invalid input or duplicate email
 * - 500: Server error
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation: Ensure all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists to prevent duplicate accounts
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password using bcryptjs (10 salt rounds) for security
    const hashed = await bcrypt.hash(password, 10);
    
    // Create new user document
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    // Log error for debugging
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/**
 * User Login Handler
 * 
 * Authenticates user credentials and generates JWT token
 * for subsequent authenticated requests.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (plain text)
 * @param {Object} res - Express response object
 * @returns {Object} JWT token and user info or error
 * 
 * Status Codes:
 * - 200: Login successful
 * - 400: Invalid credentials
 * - 500: Server error
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Ensure both credentials provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify password using bcryptjs comparison
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Generate JWT token with user ID
    // Token expires based on environment variable or default to session-based
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    res.json({ 
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    // Log error for debugging
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
