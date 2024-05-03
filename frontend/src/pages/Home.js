import React, { useEffect } from "react";
import "../styles/Home.css";
import {
  BarChart,
  BasicLineChart,
  MultiLineChart,
} from "../components/BasicLineChart";
import StravaWorkout from "../components/StravaWorkout";

function Home() {
  // const { activities, dispatch } = useAc;

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/workouts");
      const json = await response.json();
    };
  }, []);

  // fetchActivities();

  return (
    <div className="home">
      <h3>Testing Strava deets</h3>
      <StravaWorkout
        workout={{
          title: "Workout 1",
          date: "20th April 2024",
          distance: "5km",
        }}
      />

      <h3>Monthly Distance</h3>
      <p>
        This is the total distance I ran for each month km. My next task will be
        to store this in a DB where I can pull it in via API instead of just
        hardcoding it at the moment haha.
      </p>
      <BarChart />

      <h3>Single Scatter Plot</h3>
      <BasicLineChart />

      <h3>Multi Line Chart</h3>
      <MultiLineChart />
    </div>
  );
}

export default Home;
