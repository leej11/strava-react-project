import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// contexts
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import ActivitiesContextProvider from "./context/ActivityContext";
import MonthlyDistancesContextProvider from "./context/MonthlyDistancesContext";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <ActivitiesContextProvider>
      <MonthlyDistancesContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </MonthlyDistancesContextProvider>
    </ActivitiesContextProvider>
  </LocalizationProvider>
  // </React.StrictMode>
);
