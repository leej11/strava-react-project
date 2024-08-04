require("dotenv").config();
const db = require("../db");

const express = require("express");
const axios = require("axios"); // Ensure axios is imported
const {
  getActivities,
  getMonthlyDistances,
} = require("../controllers/activityController");
const {
  getStravaActivities,
  getStravaAggregatedData,
  runStravaAuth,
  stravaCallback,
} = require("../controllers/stravaController");
const router = express.Router();

// GET all activities
router.get("/", getActivities);

router.get("/monthlyDistances", getMonthlyDistances);
router.get("/aggregatedData", getStravaAggregatedData);
router.get("/stravaActivities", getStravaActivities);

router.get("/stravaAuth", runStravaAuth);
router.get("/callback", stravaCallback);

// Exchange Token for Strava
router.post("/exchange_token", async (req, res) => {
  // After the user has clicked Authorize on Strava, they get redirected
  // and this endpoint is called.
  // This function exchanges the token to receive an access token, which we will
  // securely store and then use in subsequent Strava API calls
  const { code } = req.body;
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = "http://localhost:3001/redirect"; // Ensure this matches the redirect URI used in the frontend

  console.log(
    "Attempting token exchange with:",
    clientID,
    clientSecret,
    code,
    redirectUri
  );

  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: clientID,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });
    console.log(response.data);
    console.log(response.data.access_token);

    console.log("Token exchange successful");

    if (response.data.access_token) {
      const userId = response.data.athlete.id; // assuming userId is the athlete's id
      const accessToken = response.data.access_token;
      const expiresAt = response.data.expires_at;
      const expiresIn = response.data.expires_in;

      try {
        await db.query(
          `INSERT INTO user_tokens (
            userid,
            accesstoken,
            expiresat,
            expiresin
          ) VALUES ($1, $2, $3, $4) 
          ON CONFLICT (userid) DO UPDATE SET 
            accesstoken = EXCLUDED.accesstoken,
            expiresat = EXCLUDED.expiresat,
            expiresin = EXCLUDED.expiresin`,
          [userId, accessToken, expiresAt, expiresIn]
        );
        return res.status(200).json({
          success: true,
          userId,
          accessToken,
          expiresAt,
          expiresIn,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ success: false, error: dbError.message });
      }
    }

    // const data = await res.json(response.data);
  } catch (error) {
    console.error("Error in token exchange", error);
    if (error.response) {
      // Forward the response status code and data from Strava if available
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        message: "Failed to exchange token",
        details: error.message,
      });
    }
  }
});

module.exports = router;
