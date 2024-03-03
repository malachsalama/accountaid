import { useAuthContext } from "./useAuthContext";

export function useLogout() {
  const { dispatch } = useAuthContext();
  function logout() {
    // Dispatch logout action
    dispatch({ type: "LOGOUT" });
  }
  return { logout };
}
