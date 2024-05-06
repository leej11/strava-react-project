import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ActivitiesContextProvider from "./context/ActivityContext";
import MonthlyDistancesContextProvider from "./context/MonthlyDistancesContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
// If you are using date-fns v3.x, please import the v3 adapter
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import DateCalendarPage from "./pages/DateCalendarPage";
import { ActivitiesContext } from "./context/ActivityContext";
import { MonthlyDistancesContext } from "./context/MonthlyDistancesContext";

function App() {
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ActivitiesContextProvider>
          <MonthlyDistancesContextProvider>
            <Router>
              <Navbar></Navbar>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<DateCalendarPage />} />
              </Routes>
            </Router>
          </MonthlyDistancesContextProvider>
        </ActivitiesContextProvider>
      </LocalizationProvider>
    </div>
  );
}

export default App;
