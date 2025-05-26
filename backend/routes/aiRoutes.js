const express = require("express");
const router = express.Router();
const {
  suggestPriority,
  generateDailyPlan,
  getTaskInsights,
  getMotivationalQuote,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/priority/:taskId", suggestPriority);
router.get("/daily-plan", generateDailyPlan);
router.get("/insights", getTaskInsights);
router.get("/quote", getMotivationalQuote);

module.exports = router;
