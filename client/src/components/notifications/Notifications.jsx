import { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./notifications.css";
import axios from "axios";

export default function Notifications() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [lpoProducts, setLpoProducts] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [vat, setVat] = useState(null);
  const [vatVariable, setVatVariable] = useState(null);
  const [net, setNet] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (user && accessToken) {
      try {
        const response = await axios.get(
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

        setNotificationsData(response.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    }
  }, [accessToken, user]);

  useEffect(() => {
    if (user && accessToken) {
      fetchNotifications();
    }
  }, [accessToken, fetchNotifications, user]);

  const handleLpoSelect = async (notification) => {
    setSelectedNotification(notification);

    const lpo_no = notification.unique_id;
    const company_no = user.userData.company_no;

    try {
      const response = await axios.get(
        "/api/auth/retail/fetchLpoDataForReceive",
        {
          params: { lpo_no, company_no },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const lpoProductsHolder = response.data[0].products;
      setVat(response.data[0].vat);
      setVatVariable(response.data[0].vatVariable);
      setNet(response.data[0].netTotal);

      setLpoProducts(lpoProductsHolder);
    } catch (error) {
      console.error("Error fetching LPO data", error);
    }
  };

  const handleApprove = async () => {
    if (!selectedNotification) return;

    try {
      await axios.get("/api/auth/notification/approvelpo", {
        params: {
          lpo_no: selectedNotification.unique_id,
          userData: user.userData,
          deleteId: selectedNotification._id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchNotifications();
      setLpoProducts([]);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Error approving LPO", error);
    }
  };

  if (!notificationsData || notificationsData.length === 0) {
    return <div className="notifications-container">No notifications</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-list">
        {notificationsData.map((notification) => (
          <div
            key={notification.unique_id} // Ensure unique key
            className={`notification-item ${
              selectedNotification?.unique_id === notification.unique_id
                ? "selected"
                : ""
            }`}
            onClick={() => handleLpoSelect(notification)}
          >
            {notification.heading} - {notification.unique_id}
          </div>
        ))}
      </div>
      <div className="notification-card">
        {selectedNotification && (
          <>
            <h2>{selectedNotification.heading}</h2>
            <p>{selectedNotification.body}</p>

            <h2>LPO Products</h2>
            {lpoProducts && lpoProducts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Unique ID</th>
                    <th>Company Number</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lpoProducts.map((item) => (
                    <tr key={item.unique_id}>
                      {" "}
                      {/* Ensure unique key */}
                      <td>{item.unique_id}</td>
                      <td>{item.company_no}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data available</p>
            )}

            <div>
              <p>Net: {net}</p>
              {vat === "N/A" ? (
                <>
                  <p>Vat: 0</p>
                  <p>Total: {net}</p>
                </>
              ) : (
                <>
                  <p>Vat: {(net * (vatVariable - 1)).toFixed(2)}</p>
                  <p>Total: {(net + net * (vatVariable - 1)).toFixed(2)}</p>
                </>
              )}
            </div>
            <button onClick={handleApprove} className="btn btn-success">
              Approve LPO
            </button>
          </>
        )}
      </div>
    </div>
  );
}
