import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/user/login", formData);

      const data = response.data;

      if (data.error) {
        setError(data.error);
        return false;
      } else {
        // Fetch more user info
        const userDataResponse = await axios.get(
          "/api/auth/accountaid/userpayload",
          {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          }
        );

        if (userDataResponse.status >= 200 && userDataResponse.status < 300) {
          const userData = userDataResponse.data;

          // Update the auth context with user data
          dispatch({
            type: "LOGIN",
            payload: { userData, accessToken: data.accessToken },
          });

          // Store the user in local storage
          localStorage.setItem("user", JSON.stringify(data));

          return true;
        } else {
          throw new Error(
            `Failed to fetch user data with status ${userDataResponse.status}`
          );
        }
      }
    } catch (error) {
      setError("Your User ID or Password is Incorrect");
      console.error("Login Failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
