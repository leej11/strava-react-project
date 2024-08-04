import React, { useContext, useEffect } from "react";
import "../styles/Home.css";

// Components
import { BarChart, BasicLineChart } from "../components/BasicLineChart";
import StravaWorkout from "../components/StravaWorkout";
import AuthorizationButton from "../components/AuthorizationButton";

// Contexts
import { ActivitiesContext } from "../context/ActivityContext";
import { MonthlyDistancesContext } from "../context/MonthlyDistancesContext";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { activities, dispatch: activitiesDispatch } =
    useContext(ActivitiesContext);
  const { monthlyDistances, dispatch: monthlyDistancesDispatch } = useContext(
    MonthlyDistancesContext
  );
  const { authDetails } = useContext(AuthContext);

  useEffect(() => {
    console.log("Updated Auth Details:", authDetails);

    // TODO: Currently the API doesn't provide the right header (i.e. doesn't automatically)
    // pull in the auth access token we've obtained.
    // I need to know a way of storing it in the backend securely
    const fetchStravaActivities = async () => {
      const response = await fetch("/api/activities/stravaActivities");
      const json = await response.json();

      if (response.ok) {
        activitiesDispatch({ type: "SET_ACTIVITIES", payload: json });
        console.log("Successful dispatch of activities data:", json);
      }
    };

    const fetchAggregatedData = async () => {
      const response = await fetch("/api/activities/aggregatedData");
      const json = await response.json();

      if (response.ok) {
        monthlyDistancesDispatch({
          type: "SET_MONTHLY_DISTANCES",
          payload: json,
        });
        console.log("Successful dispatch of aggregated data:", json);
      }
    };

    const fetchData = async () => {
      await fetchStravaActivities();
      await fetchAggregatedData();
    };

    fetchData();

    // now I can fetch all Strava Activities
  }, [authDetails]); // This effect runs whenever authDetails changes

  return (
    <div className="home">
      {/* <AuthorizationButton /> */}
      <div className="container">
        <div className="item">
          <h1>Monthly Distance</h1>
          <p>This is the total distance I ran for each month km.</p>
          {monthlyDistances && <BarChart data={monthlyDistances} />}
        </div>
        <div className="item">
          <h1>Latest Workouts</h1>

          {activities &&
            activities.map((activity) => (
              <StravaWorkout key={activity.id} activity={activity} />
            ))}
        </div>

        {/* <div className="item">
          <h1>Single Scatter Plot</h1>
          <BasicLineChart />
        </div> */}
      </div>
    </div>
  );
}

export default Home;
