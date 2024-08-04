require("dotenv").config();
const axios = require("axios");
const {
  getAccessToken,
  upsertActivities,
  query,
  updateLastFetchedTimestamp,
  getLastFetchedTimestamp,
} = require("../db");

const redirectUri = "http://localhost:3001/api/activities/callback"; // Ensure this matches the redirect URI registered with Strava

// Redirect users to Strava authorization URL
const runStravaAuth = (req, res) => {
  console.log("Attempting to redirect to Strava Auth", stravaAuthUrl);
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${
    process.env.CLIENT_ID
  }&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&approval_prompt=force&scope=read,activity:read_all`;

  res.redirect(stravaAuthUrl);
};

const stravaCallback = async (req, res) => {
  console.log(req.query);
  const code = req.query.code; // Strava sends the authorization code as a query parameter
  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    // Store these tokens securely and use them to make API calls
    res.send("Authorization successful, tokens are stored securely");
  } catch (error) {
    console.error("Error in token exchange:", error);
    res.status(500).send("Authorization error");
  }
};

const getStravaAggregatedData = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        TO_CHAR(start_date, 'YYYY-MM') AS yearmonth,
        SUM(distance) AS total_distance
      FROM
        activities
      GROUP BY
        TO_CHAR(start_date, 'YYYY-MM')
      ORDER BY
        TO_CHAR(start_date, 'YYYY-MM');
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).send("Error executing query");
  }
};

const getStravaActivities = async (req, res) => {
  const userId = "19160049";
  try {
    const accessToken = await getAccessToken(userId);
    console.log(`Liams accessToken: ${accessToken}`);

    const now = new Date();
    const lastFetched = await getLastFetchedTimestamp(userId);

    // If activities were fetched within the last 24 hours, skip fetching
    // if (lastFetched && now - new Date(lastFetched) < 24 * 60 * 60 * 1000) {
    //   res.status(200).send("Activities already fetched recently");
    //   return;
    // }

    let page = 1;
    const perPage = 100; // Strava API's maximum per_page value is 200
    let allActivities = [];
    let moreActivities = true;

    while (moreActivities) {
      const params = {
        page: page,
        per_page: perPage,
      };

      // if (lastFetched) {
      //   params.after = Math.floor(new Date(lastFetched).getTime() / 1000); // Convert to Unix timestamp
      //   console.log(`Pulling data since last fetch: ${lastFetched}`);
      // }

      const response = await axios.get(
        "https://www.strava.com/api/v3/athlete/activities",
        {
          params: params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const activities = response.data;

      if (activities.length > 0) {
        allActivities = allActivities.concat(activities);
        page += 1;
      } else {
        moreActivities = false;
      }
    }

    // Upsert all activities into the database in a single batch
    await upsertActivities(allActivities);

    // Update the last fetched timestamp
    await updateLastFetchedTimestamp(userId, now);

    res.status(200).json(allActivities); // Sending the extracted data in the response
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getStravaActivities,
  getStravaAggregatedData,
  runStravaAuth,
  stravaCallback,
};
