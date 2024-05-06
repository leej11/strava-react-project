import React, { useContext } from "react";
import "../styles/Home.css";
import { BarChart, BasicLineChart } from "../components/BasicLineChart";
import StravaWorkout from "../components/StravaWorkout";
import { ActivitiesContext } from "../context/ActivityContext";
import { MonthlyDistancesContext } from "../context/MonthlyDistancesContext";

function Home() {
  const { activities } = useContext(ActivitiesContext);
  const { monthlyDistances } = useContext(MonthlyDistancesContext);

  return (
    <div className="home">
      <div className="container">
        <div className="item">
          <h1>Latest Workouts</h1>

          {activities &&
            activities.map((activity) => (
              <StravaWorkout key={activity.id} activity={activity} />
            ))}
        </div>
        <div className="item">
          <h1>Monthly Distance</h1>
          <p>
            This is the total distance I ran for each month km. My next task
            will be to store this in a DB where I can pull it in via API instead
            of just hardcoding it at the moment haha.
          </p>
          {monthlyDistances && <BarChart data={monthlyDistances} />}
        </div>
        <div className="item">
          <h1>Single Scatter Plot</h1>
          <BasicLineChart />
        </div>
      </div>
    </div>
  );
}

export default Home;
