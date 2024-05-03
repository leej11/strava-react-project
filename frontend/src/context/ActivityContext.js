import { createContext, useReducer } from "react";

export const ActivitiesContext = createContext();

export const activitiesReducer = (state, action) => {
  switch (action.type) {
    case "SET_ACTIVITIES":
      return {
        activities: action.payload,
      };
    default:
      return state;
  }
};

export const activitiesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(activitiesReducer, { activities: null });

  return (
    <ActivitiesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ActivitiesContext.Provider>
  );
};
