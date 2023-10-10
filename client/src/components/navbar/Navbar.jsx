import { useLogout } from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./navbar.css";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();  

  const handleLogin = () => {
    navigate("/");
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="header">
      <h2>Account Aid</h2>
      <nav>
        {user && (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!user && <button onClick={handleLogin}>Login</button>}
      </nav>
    </div>
  );
}
