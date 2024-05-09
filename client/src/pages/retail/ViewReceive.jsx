import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";

function ViewReceive() {
  const location = useLocation();
  const accessToken = useAuthToken();
  const { user } = useAuthContext();
  const lpoData = location.state && location.state.lpoData;
  const lpo = location.state && location.state.lpo;
  const [selectedLpos, setSelectedLpos] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [variables, setVariables] = useState([]);
  const { vat } = lpo[0];

  useEffect(() => {
    const fetchVariables = async () => {
      if (accessToken && user) {
        // Check if user is not null
        try {
          const subCompanyNo = user.userData.company_no;
          const response = await axios.get("/api/auth/retail/fetchVariables", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              subCompanyNo: subCompanyNo,
            },
          });

          setVariables(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchVariables();
  }, [accessToken, user]);

  const handleCheckboxChange = (lpo_id, price, quantity) => {
    // Toggle the selection status of the LPO
    setSelectedLpos((prevSelected) => {
      if (prevSelected.includes(lpo_id)) {
        return prevSelected.filter((id) => id !== lpo_id);
      } else {
        return [...prevSelected, lpo_id];
      }
    });

    // Update the total price based on the checkbox change
    setTotalPrice((prevTotalPrice) => {
      if (selectedLpos.includes(lpo_id)) {
        // If the LPO was already selected, subtract its price
        return prevTotalPrice - price * quantity;
      } else {
        // If the LPO is newly selected, add its price
        return prevTotalPrice + price * quantity;
      }
    });
  };

  return (
    <div>
      <h2>Received LPO Data</h2>
      {lpoData && lpoData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Unique ID</th>
              <th>Company Number</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {lpoData.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleCheckboxChange(item._id, item.price, item.quantity)
                    }
                    checked={selectedLpos.includes(item._id)}
                  />
                </td>
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
      {vat == "N/A" ? (
        <div>
          <p>Net : {totalPrice}</p>
          <p>Vat : {0}</p>
          <p>Total : {totalPrice}</p>
        </div>
      ) : (
        <div>
          <p>Net : {totalPrice}</p>
          <p>Vat : {totalPrice * (variables.vat / 100)}</p>
          <p>Total : {totalPrice + totalPrice * (variables.vat / 100)}</p>
        </div>
      )}
    </div>
  );
}

export default ViewReceive;
