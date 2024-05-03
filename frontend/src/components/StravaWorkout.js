import React from "react";

const StravaWorkout = ({ workout }) => {
  return (
    <div className="strava-workout">
      <h4>Title: {workout.title}</h4>
      <p>Date: {workout.date}</p>
      <p>Distance (km): {workout.distance}</p>
    </div>
  );
};

export default StravaWorkout;
