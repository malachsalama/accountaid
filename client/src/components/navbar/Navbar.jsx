import { FaBell } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";
import axios from "axios";
import socketIOClient from "socket.io-client";
import "./navbar.css";

const ENDPOINT = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export default function Navbar() {
  const { logout } = useLogout();
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthToken();

  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleLogin = () => {
    navigate("/");
  };

  const handleNotification = async () => {
    if (user && accessToken) {
      try {
        const fetchNotifications = await axios.get(
          "/api/auth/notifications/fetchnotifications",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              userData: user.userData,
            },
          }
        );

        // Navigate to the notification page
        navigate("notifications", {
          state: { notifications: fetchNotifications.data },
        });
      } catch (error) {
        console.error("Error fetching notification", error);
      }
    }
  };

  // Function with API to fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (user && accessToken && user.userData) {
      try {
        const fetchNotifications = await axios.get(
          "/api/auth/notifications/fetchnotifications",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              userData: user.userData,
            },
          }
        );

        const notificationsData = fetchNotifications.data.length;

        setUnreadMessages(notificationsData);
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

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("lpoClosed", (data) => {
      console.log("LPO Closed Notification:", data); // Log the data for debugging
      // Increment the unread messages count when an LPO is closed
      setUnreadMessages((prevCount) => prevCount + 1);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

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
