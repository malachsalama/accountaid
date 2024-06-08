import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Stock() {
  const accessToken = useAuthToken();
  const { user } = useAuthContext();
  const { company_no } = user.userData;
  const [stockData, setStockData] = useState([]);

  const fetchStock = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/retail/fetchstock", {
        params: { company_no },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const cleanedStockData = response.data.map((item) => ({
        companyNumber: item.company_no,
        dateReceived: new Date(item.date_received).toISOString().split("T")[0],
        description: item.description,
        price: Number(item.price),
        quantity: Number(item.quantity),
        uniqueId: item.unique_id,
      }));

      setStockData(cleanedStockData);
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  }, [accessToken, company_no]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return (
    <div className="stock-container">
      <h1>Stock Data</h1>
      {stockData.length > 0 ? (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>

              <th>Date Received</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item, index) => (
              <tr key={index}>
                <td>{item.uniqueId}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.dateReceived}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stock data available.</p>
      )}
    </div>
  );
}
