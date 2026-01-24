const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createLink,
  getMyLinks,
  updateLink,
  deleteLink,
  reorderLinks,
  getPublicLinks,
  getPublicHubBySlug,
  trackClick,
  getAnalytics,
  exportAnalytics
} = require("../controllers/linkController");

const router = express.Router();

router.post("/link", auth, createLink);
router.get("/links", auth, getMyLinks);
router.put("/link/:id", auth, updateLink);
router.delete("/link/:id", auth, deleteLink);
router.post("/links/reorder", auth, reorderLinks);
router.get("/analytics", auth, getAnalytics);
router.get("/analytics/export/:userId", exportAnalytics);

// Public routes - no authentication required
router.get("/public/:userId", getPublicLinks);  // Legacy route (by user ID)
router.get("/hub/:slug", getPublicHubBySlug);   // New route (by slug)

router.post("/click/:id", trackClick);

module.exports = router;
