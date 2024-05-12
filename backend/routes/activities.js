const express = require("express");
const {
  getActivities,
  getMonthlyDistances,
} = require("../controllers/activityController");
const { getStravaActivities } = require("../controllers/stravaController");
const router = express.Router();

// GET all activities
router.get("/", getActivities);

router.get("/monthlyDistances", getMonthlyDistances);

router.get("/stravaActivities", getStravaActivities);

module.exports = router;
