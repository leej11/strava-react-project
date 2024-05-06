import React, { useContext, useEffect } from "react";
import "../styles/Home.css";
import { BarChart, BasicLineChart } from "../components/BasicLineChart";
import StravaWorkout from "../components/StravaWorkout";
import { ActivitiesContext } from "../context/ActivityContext";
import { MonthlyDistancesContext } from "../context/MonthlyDistancesContext";

function Home() {
  const { activities, dispatch: activitiesDispatch } =
    useContext(ActivitiesContext);
  const { monthlyDistances = null, dispatch: monthlyDispatch } = useContext(
    MonthlyDistancesContext
  );

  // This will run once upon load, and get all the activities. Currently
  // it's just logging the activities to the console.
  // we want instead to put it into state, so that it can be interacted with
  // and displayed
  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/activities");
      const json = await response.json();

      if (response.ok) {
        activitiesDispatch({ type: "SET_ACTIVITIES", payload: json });
        console.log("Successful dispatch of activities!!");
      }
    };

    const fetchMonthlyDistances = async () => {
      const response = await fetch("/api/activities/monthlyDistances");
      const json = await response.json();

      if (response.ok) {
        monthlyDispatch({ type: "SET_MONTHLY_DISTANCES", payload: json });
        console.log(json);

        window.monthlyDistances = json;
      }
    };

    fetchActivities();
    fetchMonthlyDistances();
  }, []);

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
