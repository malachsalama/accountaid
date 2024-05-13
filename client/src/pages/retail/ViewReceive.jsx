import { useState } from "react";
import { useLocation } from "react-router-dom";

function ViewReceive() {
  const location = useLocation();
  const lpo = location.state && location.state.lpo;
  const [selectedLpos, setSelectedLpos] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { vat, vatVariable } = lpo[0];

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
      {lpo && lpo.length > 0 ? (
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
            {lpo[0].products.map((item, index) => (
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
      <div>
        <p>Net : {totalPrice}</p>
        {vat === "N/A" ? (
          <>
            <p>Vat : {0}</p>
            <p>Total : {totalPrice}</p>
          </>
        ) : (
          <>
            <p>Vat : {totalPrice * (vatVariable / 100)}</p>
            <p>Total : {totalPrice + totalPrice * (vatVariable / 100)}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewReceive;
