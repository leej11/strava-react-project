const axios = require("axios");

const headers = {
  Authorization: "Bearer 28d79149abb3b7457c0c4f104ccc81e80d516b43",
};

const getStravaActivities = async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      { headers }
    );
    const activities = response.data; // Extracting data from the response

    console.log(activities); // Logging the extracted data to the console

    res.status(200).json(activities); // Sending the extracted data in the response
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getStravaActivities,
};
