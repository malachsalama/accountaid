import { useAuthContext } from "./useAuthContext";

export const useAuthToken = () => {
  const { user } = useAuthContext();

  // Check if user is authenticated and has an accessToken
  const accessToken = user?.accessToken || null;

  return accessToken;
};
