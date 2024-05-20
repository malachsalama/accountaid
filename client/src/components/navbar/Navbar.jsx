import { FaBell } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";
import "./navbar.css";
import axios from "axios";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthToken();
  const unreadMessages = 5;

  const [notifications, setNotifications] = useState();

  const handleLogin = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  //function with API to fetch notifications
  const fetchNotifications = async () => {
    if (accessToken) {
      try {
        const notifications = await axios.get(
          "/api/auth/fetchNotifications",
          {
            userData: user.userData,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const notificationsData = notifications.data;
        setNotifications(notificationsData);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Not access token");
      console.log(accessToken);
    }
  };

  //useEffect to fetch all notifications per company
  useEffect(() => {
    fetchNotifications();

    console.log(notifications);
  });

  const handleNotification = () => {
    navigate("/retail/");
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
<<<<<<< HEAD
              onClick={() => handleNotification()}
=======
              onClick={() => console.log("Clicked!")}
>>>>>>> main
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
