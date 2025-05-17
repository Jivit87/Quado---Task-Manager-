const express = require("express");
const router = express.Router();
const {
  suggestPriority,
  generateDailyPlan,
  getTaskInsights,
  getMotivationalQuote,
  getWeeklyFocusSuggestion,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/priority/:taskId", suggestPriority);
router.get("/daily-plan", generateDailyPlan);
router.get("/insights", getTaskInsights);
router.get("/quote", getMotivationalQuote);

router.get("/weekly-focus", protect, getWeeklyFocusSuggestion);

module.exports = router;
