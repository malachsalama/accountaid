/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useReducer, useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { user: null };
    default:
      return state;
  }
}

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true); // Set loading state to true before API call
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.accessToken && isTokenValid(user.accessToken)) {
          // Check for both user and accessToken
          dispatch({
            type: "LOGIN",
            payload: { userData: user, accessToken: user.accessToken },
          });
          const accessToken = user.accessToken;

          const response = await axios.get("/api/auth/accountaid/userpayload", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status >= 200 && response.status < 300) {
            const userData = response.data;
            dispatch({ type: "LOGIN", payload: { userData, accessToken } });
          } else {
            throw new Error(`Request failed with status ${response.status}`);
          }
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Token expired or invalid, logout the user
          dispatch({ type: "LOGOUT" });
        }
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after operation
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
