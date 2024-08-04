import { createContext, useReducer } from "react";

export const AuthContext = createContext();

const initialState = {
  authDetails: null,
};

export const authReducer = (state, action) => {
  console.log("Reducer action received:", action);
  switch (action.type) {
    case "SET_AUTH":
      console.log("Setting auth:", action.payload);
      return {
        authDetails: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
