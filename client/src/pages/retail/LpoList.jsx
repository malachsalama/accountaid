import { useState, useEffect } from "react";
import axios from "axios";

export default function LpoList() {
  const [lpos, setLpos] = useState([]);

  useEffect(() => {
    const fetchLpos = async () => {
      try {
        const response = await axios.get("/api/auth/retail/lpos");
        setLpos(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLpos();
  }, []);

  return (
    <>
      <h2>List of All Lpos</h2>
      <div className="table-container">
        <table className="lpo-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>supplierName</th>
              <th>kra_pin</th>
              <th>usd_rate</th>
              <th>lpo_no</th>
              <th>netTotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lpos.map((item, index) => (
              <tr key={index}>
                <td>{item.supplier}</td>
                <td>{item.supplierName}</td>
                <td>{item.kra_pin}</td>
                <td>{item.usd_rate}</td>
                <td>{item.lpo_no}</td>
                <td>{item.netTotal}</td>
                <td>
                  <button>View</button>
                  <button>Delete</button>
                  <button>Receive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
