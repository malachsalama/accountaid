import { useAuthContext } from "./useAuthContext";

export function useLogout() {
  const { dispatch } = useAuthContext();
  function logout() {
    // Clear user from localStorage
    localStorage.removeItem("user");

    // Dispatch logout action
    dispatch({ type: "LOGOUT" });
  }
  return { logout };
}
