import { FaBell } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";
import axios from "axios";
import "./navbar.css";

export default function Navbar() {
  const { logout } = useLogout();
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthToken();

  const [notifications, setNotifications] = useState(0);

  let unreadMessages = notifications;

  const handleLogin = () => {
    navigate("/");
  };

  const handleNotification = () => {
    navigate("/retail/");
  };

  // Function with API to fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (user && accessToken && user.userData) {
      try {
        const response = await axios.get("/api/auth/fetchnotifications", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            userData: user.userData,
          },
        });

        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    }
  }, [accessToken, user]);

  useEffect(() => {
    if (!isLoading && user && accessToken) {
      fetchNotifications();
    }
  }, [isLoading, accessToken, fetchNotifications, user]);

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
              onClick={handleNotification}
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
