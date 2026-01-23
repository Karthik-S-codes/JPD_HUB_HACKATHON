const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createLink,
  getMyLinks,
  updateLink,
  deleteLink,
  reorderLinks,
  getPublicLinks,
  trackClick,
  getAnalytics
} = require("../controllers/linkController");

const router = express.Router();

router.post("/link", auth, createLink);
router.get("/links", auth, getMyLinks);
router.put("/link/:id", auth, updateLink);
router.delete("/link/:id", auth, deleteLink);
router.post("/links/reorder", auth, reorderLinks);
router.get("/analytics", auth, getAnalytics);
router.get("/public/:userId", getPublicLinks);
router.post("/click/:id", trackClick);

module.exports = router;
