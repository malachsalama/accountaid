import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("UseAuthContext must be used inside an AuthContextProvider");
  }

  return context;
}
