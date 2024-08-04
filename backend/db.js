require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: process.env.POSTGRES_PWD,
  host: "localhost",
  port: process.env.POSTGRES_PORT, // default Postgres port
  database: "strava_activities_utf8",
  charset: "utf8",
});

const allowedColumns = [
  "resource_state",
  "athlete",
  "name",
  "distance",
  "moving_time",
  "elapsed_time",
  "total_elevation_gain",
  "type",
  "sport_type",
  "workout_type",
  "id",
  "start_date",
  "start_date_local",
  "timezone",
  "utc_offset",
  "location_city",
  "location_state",
  "location_country",
  "achievement_count",
  "kudos_count",
  "comment_count",
  "athlete_count",
  "photo_count",
  "map",
  "trainer",
  "commute",
  "manual",
  "private",
  "visibility",
  "flagged",
  "gear_id",
  "start_latlng",
  "end_latlng",
  "average_speed",
  "max_speed",
  "has_heartrate",
  "average_heartrate",
  "max_heartrate",
  "heartrate_opt_out",
  "display_hide_heartrate_option",
  "elev_high",
  "elev_low",
  "upload_id",
  "upload_id_str",
  "external_id",
  "from_accepted_tag",
  "pr_count",
  "total_photo_count",
  "has_kudoed",
];

const filterActivity = (activity) => {
  const filteredActivity = {};
  allowedColumns.forEach((column) => {
    if (column in activity) {
      if (column === "athlete") {
        filteredActivity["user_id"] = activity.athlete.id;
      } else if (column === "map") {
        filteredActivity["map_id"] = activity.map.id;
        filteredActivity["summary_polyline"] = activity.map.summary_polyline;
      } else {
        filteredActivity[column] = activity[column];
      }
    }
  });
  return filteredActivity;
};

const filterActivities = (activities) => activities.map(filterActivity);

const getAccessToken = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT accesstoken FROM user_tokens WHERE userid = $1",
      [userId]
    );
    if (result.rows.length > 0) {
      console.log(result);
      return result.rows[0].accesstoken;
    } else {
      throw new Error("No access token found for the user");
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

const updateLastFetchedTimestamp = async (userId, timestamp) => {
  await pool.query(
    "UPDATE user_tokens SET last_fetched = $1 WHERE userid = $2",
    [timestamp, userId]
  );
};

const getLastFetchedTimestamp = async (userId) => {
  const result = await pool.query(
    "SELECT last_fetched FROM user_tokens WHERE userid = $1",
    [userId]
  );
  return result.rows[0]?.last_fetched;
};

const upsertActivities = async (activities) => {
  if (activities.length === 0) return;

  const filteredActivities = filterActivities(activities);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query = `
      INSERT INTO activities (
        user_id, activity_id, name, distance, moving_time, elapsed_time, total_elevation_gain, type, sport_type, workout_type, start_date, start_date_local, timezone, utc_offset, location_city, location_state, location_country, achievement_count, kudos_count, comment_count, athlete_count, photo_count, map_id, summary_polyline, trainer, commute, manual, private, visibility, flagged, gear_id, start_latlng, end_latlng, average_speed, max_speed, has_heartrate, average_heartrate, max_heartrate, heartrate_opt_out, display_hide_heartrate_option, elev_high, elev_low, upload_id, upload_id_str, external_id, from_accepted_tag, pr_count, total_photo_count, has_kudoed
      ) VALUES ${filteredActivities
        .map(
          (_, index) => `
        (
          $${index * 49 + 1}, $${index * 49 + 2}, $${index * 49 + 3}, $${
            index * 49 + 4
          }, $${index * 49 + 5}, $${index * 49 + 6}, $${index * 49 + 7}, $${
            index * 49 + 8
          }, $${index * 49 + 9}, $${index * 49 + 10}, $${index * 49 + 11}, $${
            index * 49 + 12
          }, $${index * 49 + 13}, $${index * 49 + 14}, $${index * 49 + 15}, $${
            index * 49 + 16
          }, $${index * 49 + 17}, $${index * 49 + 18}, $${index * 49 + 19}, $${
            index * 49 + 20
          }, $${index * 49 + 21}, $${index * 49 + 22}, $${index * 49 + 23}, $${
            index * 49 + 24
          }, $${index * 49 + 25}, $${index * 49 + 26}, $${index * 49 + 27}, $${
            index * 49 + 28
          }, $${index * 49 + 29}, $${index * 49 + 30}, $${index * 49 + 31}, $${
            index * 49 + 32
          }, $${index * 49 + 33}, $${index * 49 + 34}, $${index * 49 + 35}, $${
            index * 49 + 36
          }, $${index * 49 + 37}, $${index * 49 + 38}, $${index * 49 + 39}, $${
            index * 49 + 40
          }, $${index * 49 + 41}, $${index * 49 + 42}, $${index * 49 + 43}, $${
            index * 49 + 44
          }, $${index * 49 + 45}, $${index * 49 + 46}, $${index * 49 + 47}, $${
            index * 49 + 48
          }, $${index * 49 + 49}
        )
      `
        )
        .join(", ")}
      ON CONFLICT (activity_id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        name = EXCLUDED.name,
        distance = EXCLUDED.distance,
        moving_time = EXCLUDED.moving_time,
        elapsed_time = EXCLUDED.elapsed_time,
        total_elevation_gain = EXCLUDED.total_elevation_gain,
        type = EXCLUDED.type,
        sport_type = EXCLUDED.sport_type,
        workout_type = EXCLUDED.workout_type,
        start_date = EXCLUDED.start_date,
        start_date_local = EXCLUDED.start_date_local,
        timezone = EXCLUDED.timezone,
        utc_offset = EXCLUDED.utc_offset,
        location_city = EXCLUDED.location_city,
        location_state = EXCLUDED.location_state,
        location_country = EXCLUDED.location_country,
        achievement_count = EXCLUDED.achievement_count,
        kudos_count = EXCLUDED.kudos_count,
        comment_count = EXCLUDED.comment_count,
        athlete_count = EXCLUDED.athlete_count,
        photo_count = EXCLUDED.photo_count,
        map_id = EXCLUDED.map_id,
        summary_polyline = EXCLUDED.summary_polyline,
        trainer = EXCLUDED.trainer,
        commute = EXCLUDED.commute,
        manual = EXCLUDED.manual,
        private = EXCLUDED.private,
        visibility = EXCLUDED.visibility,
        flagged = EXCLUDED.flagged,
        gear_id = EXCLUDED.gear_id,
        start_latlng = EXCLUDED.start_latlng,
        end_latlng = EXCLUDED.end_latlng,
        average_speed = EXCLUDED.average_speed,
        max_speed = EXCLUDED.max_speed,
        has_heartrate = EXCLUDED.has_heartrate,
        average_heartrate = EXCLUDED.average_heartrate,
        max_heartrate = EXCLUDED.max_heartrate,
        heartrate_opt_out = EXCLUDED.heartrate_opt_out,
        display_hide_heartrate_option = EXCLUDED.display_hide_heartrate_option,
        elev_high = EXCLUDED.elev_high,
        elev_low = EXCLUDED.elev_low,
        upload_id = EXCLUDED.upload_id,
        upload_id_str = EXCLUDED.upload_id_str,
        external_id = EXCLUDED.external_id,
        from_accepted_tag = EXCLUDED.from_accepted_tag,
        pr_count = EXCLUDED.pr_count,
        total_photo_count = EXCLUDED.total_photo_count,
        has_kudoed = EXCLUDED.has_kudoed;
    `;

    const values = filteredActivities.flatMap((activity) => [
      activity.user_id,
      activity.id,
      activity.name,
      activity.distance,
      activity.moving_time,
      activity.elapsed_time,
      activity.total_elevation_gain,
      activity.type,
      activity.sport_type,
      activity.workout_type,
      activity.start_date,
      activity.start_date_local,
      activity.timezone,
      activity.utc_offset,
      activity.location_city,
      activity.location_state,
      activity.location_country,
      activity.achievement_count,
      activity.kudos_count,
      activity.comment_count,
      activity.athlete_count,
      activity.photo_count,
      activity.map_id,
      activity.summary_polyline,
      activity.trainer,
      activity.commute,
      activity.manual,
      activity.private,
      activity.visibility,
      activity.flagged,
      activity.gear_id,
      activity.start_latlng,
      activity.end_latlng,
      activity.average_speed,
      activity.max_speed,
      activity.has_heartrate,
      activity.average_heartrate,
      activity.max_heartrate,
      activity.heartrate_opt_out,
      activity.display_hide_heartrate_option,
      activity.elev_high,
      activity.elev_low,
      activity.upload_id,
      activity.upload_id_str,
      activity.external_id,
      activity.from_accepted_tag,
      activity.pr_count,
      activity.total_photo_count,
      activity.has_kudoed,
    ]);

    await client.query(query, values);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`Error upserting activities:`, error);
  } finally {
    client.release();
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  upsertActivities,
  getAccessToken,
  updateLastFetchedTimestamp,
  getLastFetchedTimestamp,
};
// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };
