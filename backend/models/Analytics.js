const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ipAddress: String,
  country: String,
  device: { type: String, enum: ["mobile", "desktop", "tablet"], default: "desktop" }
});

module.exports = mongoose.model("Analytics", analyticsSchema);
