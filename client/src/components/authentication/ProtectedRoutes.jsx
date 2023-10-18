/* eslint-disable react/prop-types */
import { useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function ProtectedRoutes({ children }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return <>{children}</>;
}
