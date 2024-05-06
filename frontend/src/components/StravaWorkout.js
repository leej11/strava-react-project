import React from "react";
import { formatDistanceToNow, formatDate } from "date-fns";

const StravaWorkout = ({ activity }) => {
  return (
    <div className="strava-workout">
      <h4>{formatDate(activity.startdate, "EEEE, do MMMM yyyy, h:mma")}</h4>
      <p>{formatDistanceToNow(activity.startdate, { addSuffix: true })}</p>
      <p>Distance: {(activity.totaldistance / 1000).toFixed(1) + "K"}</p>
    </div>
  );
};

export default StravaWorkout;
