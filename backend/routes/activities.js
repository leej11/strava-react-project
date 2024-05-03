const express = require("express");
const { getActivities } = require("../controllers/activityController");
const router = express.Router();

// GET all activities
router.get("/", getActivities);

module.exports = router;
