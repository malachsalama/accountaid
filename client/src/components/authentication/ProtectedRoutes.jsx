/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Dashboard from "../dashboard/Dashboard";

export default function ProtectedRoutes({ children }) {
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div>Loading, please wait...</div>;
  }

  return (
    <>
      {user && <Dashboard />}
      {children}
    </>
  );
}
