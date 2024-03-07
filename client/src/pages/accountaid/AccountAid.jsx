import { useNavigate } from "react-router-dom";

export default function SuperAdminHome() {
  const navigate = useNavigate();
  return (
    <>
      <h2>Super Admin Dashboard</h2>
      <button onClick={() => navigate("reg-company")}>Register Company</button>
    </>
  );
}
