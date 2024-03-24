import { useNavigate } from "react-router-dom";

export default function SuperAdminHome() {
  const navigate = useNavigate();
  return (
    <>
      <h2>Account Aid Dashboard</h2>
      <button onClick={() => navigate("reg-company")}>Register Company</button>
      <button onClick={() => navigate("edit-variables")}>Variables</button>
    </>
  );
}
