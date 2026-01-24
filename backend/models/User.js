const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hubSlug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true  // Add index for faster slug lookups
  },
  hubTitle: { type: String, default: "My Links" },
  hubDescription: { type: String, default: "" },
  theme: { type: String, default: "dark", enum: ["dark", "light"] },
  accentColor: { type: String, default: "#00ff00" },
  totalVisits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
