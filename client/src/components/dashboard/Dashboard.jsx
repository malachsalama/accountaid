import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./dashboard.css";

export default function Dashboard() {
  const { user, isLoading } = useAuthContext();
  const { department } = user.userData;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Dashboard_div">
      <Link to="/">Dashboard</Link>.
      {department === "Retail" && (
        <div>
          <Link to="/retail/stock">Stock</Link>.
          <Link to="/retail/reports">Reports</Link>
        </div>
      )}
      {department === "Admin" && (
        <div>
          <Link to="/admin">
            <button>Admin</button>
          </Link>
          <Link to="/admin/settings">
            <button>Admin Settings</button>
          </Link>
        </div>
      )}
    </div>
  );
}
