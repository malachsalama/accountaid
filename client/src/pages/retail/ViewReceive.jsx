import { useState } from "react";
import { useLocation } from "react-router-dom";

function ViewReceive() {
  const location = useLocation();
  const lpoData = location.state && location.state.lpoData;
  const [selectedLpos, setSelectedLpos] = useState([]);

  const handleCheckboxChange = (lpo_id) => {
    // Toggle the selection status of the lpo
    setSelectedLpos((prevSelected) => {
      if (prevSelected.includes(lpo_id)) {
        return prevSelected.filter((id) => id !== lpo_id);
      } else {
        return [...prevSelected, lpo_id];
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
              <th>Select</th> {/* Add a column for checkboxes */}
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
                  {/* Checkbox for selecting the LPO */}
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(item._id)}
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
    </div>
  );
}

export default ViewReceive;
