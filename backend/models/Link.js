const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  type: { type: String, enum: ["time", "device", "location", "performance"], default: "time" },
  condition: String,
  active: { type: Boolean, default: true }
});

const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, default: "" },
  clicks: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  rules: [ruleSchema],
  qrCode: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Link", linkSchema);
