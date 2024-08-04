import React from "react";
import { formatDistanceToNow, formatDate } from "date-fns";

const StravaWorkout = ({ activity }) => {
  return (
    <div className="strava-workout">
      <h4>{formatDate(activity.start_date, "EEEE, do MMMM yyyy, h:mma")}</h4>
      <p>{formatDistanceToNow(activity.start_date, { addSuffix: true })}</p>
      <p>Distance: {(activity.distance / 1000).toFixed(1) + "K"}</p>
    </div>
  );
};

export default StravaWorkout;
