import axios from "axios";
import { useEffect, useState } from "react";
import "../../pages/retail/retail.css";

export default function CreditorList() {
  const [creditors, setCreditors] = useState([]);

  useEffect(() => {
    async function fetchCreditors() {
      const response = await axios.get("/api/auth/accounts/creditors");
      console.log(response);
      setCreditors(response.data);
    }

    fetchCreditors();
  }, []);

  return (
    <div>
      Here Are Our Creditors
      <div className="table-container">
        <table className="lpo-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>KRA PIN</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Account No</th>
            </tr>
          </thead>
          <tbody>
            {creditors.map((creditor, index) => (
              <tr key={index}>
                <td>{creditor.name}</td>
                <td>{creditor.company}</td>
                <td>{creditor.kra_pin}</td>
                <td>{creditor.email}</td>
                <td>{creditor.phone_no}</td>
                <td>{creditor.acc_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
