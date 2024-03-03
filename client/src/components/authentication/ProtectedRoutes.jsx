/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  return <>{children}</>;
}
