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

      // Check if the response indicates an error
      if (data.error) {
        setIsLoading(false);
        setError(data.error);
        return false;
      } else {
        // Update the auth context
        dispatch({ type: "LOGIN", payload: data });

        // Update loading state
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      setError("Your User ID or Password is Incorrect");
    }
  };

  return { login, isLoading, error };
};
