import { useLogout } from "../../hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./navbar.css";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLoginPage = location.pathname === "/";

  return (
    <div className="header">
      <h2>Account Aid</h2>
      <nav>
        {user && (
          <>
            {!isLoginPage && (
              <span className="welcome-text">
                Welcome, {user.userData.username}
              </span>
            )}
            {!isLoginPage && (
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            )}
          </>
        )}
        {!user && !isLoginPage && <button onClick={handleLogin}>Login</button>}
      </nav>
    </div>
  );
}
