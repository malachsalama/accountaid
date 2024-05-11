import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function LpoList() {
  const [lpos, setLpos] = useState([]);
  const accessToken = useAuthToken();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLpos = async () => {
      if (accessToken && user) {
        // Check if user is not null
        try {
          const response = await axios.get(
            `/api/auth/retail/lpos/${user.userData.company_no}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setLpos(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchLpos();
  }, [accessToken, user]);

  const handlePdf = async (lpo_no) => {
    try {
      const response = await axios.get("/api/auth/pdflpo", {
        params: { lpo_no },
        responseType: "blob", // Request binary data
      });

      // Create a blob URL and open it in a new window
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleReceive = async (lpo_no) => {
    try {
      const userData = user.userData.company_no;
      const response = await axios.get(
        "/api/auth/retail/fetchLpoDataForReceive",
        {
          params: { lpo_no, userData },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      navigate("/retail/viewReceive", { state: { lpo: response.data.lpo } });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

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
                  <button onClick={() => handlePdf(item.lpo_no)}>View</button>
                  <button>Delete</button>
                  <button onClick={() => handleReceive(item.lpo_no)}>
                    Receive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
