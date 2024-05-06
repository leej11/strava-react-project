const express = require("express");
const {
  getActivities,
  getMonthlyDistances,
} = require("../controllers/activityController");
const router = express.Router();

// GET all activities
router.get("/", getActivities);

router.get("/monthlyDistances", getMonthlyDistances);

module.exports = router;
