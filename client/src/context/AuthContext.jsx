/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

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
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          dispatch({ type: "LOGIN", payload: user });
        }

        const accessToken = user.accessToken;
        if (!accessToken) {
          throw new Error("Access token not found in user data");
        }

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
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
