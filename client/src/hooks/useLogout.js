import { useAuthContext } from "./useAuthContext";

export function useLogout() {
  const { dispatch } = useAuthContext();
  function Logout() {
    // Remove user from local storage
    localStorage.removeItem("user");

    // Dispatch logout action
    dispatch({ type: "LOGOUT" });
  }
  return { Logout };
}
