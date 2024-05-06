import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// components
import Navbar from "./components/Navbar";
// pages
import Home from "./pages/Home";
import DateCalendarPage from "./pages/DateCalendarPage";

// contexts
import { ActivitiesContext } from "./context/ActivityContext";
import { MonthlyDistancesContext } from "./context/MonthlyDistancesContext";

function App() {
  const { dispatch: activitiesDispatch } = useContext(ActivitiesContext);
  const { dispatch: monthlyDispatch } = useContext(MonthlyDistancesContext);

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
        console.log("Successful dispatch of activities data:", json);
      }
    };

    const fetchMonthlyDistances = async () => {
      const response = await fetch("/api/activities/monthlyDistances");
      const json = await response.json();

      if (response.ok) {
        monthlyDispatch({ type: "SET_MONTHLY_DISTANCES", payload: json });
        console.log("Successful dispatch of monthly distances data:", json);

        // window.monthlyDistances = json;
      }
    };

    fetchActivities();
    fetchMonthlyDistances();
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex-column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<DateCalendarPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
