import { FaBell } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./navbar.css";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const unreadMessages = 5;

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
            <button
              className="notification-button"
              onClick={() => console.log("Clicked!")}
            >
              <FaBell className="notification-icon" size={24} />
              {unreadMessages > 0 && (
                <span className="unread-count">{unreadMessages}</span>
              )}
            </button>
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
