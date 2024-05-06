import { createContext, useReducer } from "react";

export const MonthlyDistancesContext = createContext();

export const monthlyDistancesReducer = (state, action) => {
  switch (action.type) {
    case "SET_MONTHLY_DISTANCES":
      return {
        monthlyDistances: action.payload,
      };
    default:
      return state;
  }
};

export const MonthlyDistancesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(monthlyDistancesReducer, {
    monthlyDistances: null,
  });

  return (
    <MonthlyDistancesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MonthlyDistancesContext.Provider>
  );
};

export default MonthlyDistancesContextProvider;
