/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
}

export function AuthContextProvider({ children }) {
  // Retrieve user from local storage on initial load
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [state, dispatch] = useReducer(authReducer, { user: storedUser });

  // Effect to persist user data to local storage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
