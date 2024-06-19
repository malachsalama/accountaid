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

  const company_no = user?.userData?.company_no;

  useEffect(() => {
    const fetchLpos = async () => {
      if (accessToken && user) {
        try {
          const response = await axios.get(
            `/api/auth/retail/lpos/${company_no}`,
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

  const handlePdf = async (lpo_no, company_no) => {
    try {
      const response = await axios.get("/api/auth/pdflpo", {
        params: { lpo_no, company_no },
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
      const response = await axios.get(
        "/api/auth/retail/fetchLpoDataForReceive",
        {
          params: { lpo_no, company_no },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      navigate("/retail/viewReceive", { state: { lpo: response.data } });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleDeleteLpo = async (lpoId, company_no) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this LPO?"
      );

      if (confirmation) {
        await axios.delete(
          `/api/auth/retail/lpos/${lpoId}?company_no=${company_no}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        // Update UI after successful deletion
        setLpos(lpos.filter((lpo) => lpo._id !== lpoId));
      }
    } catch (error) {
      console.error("Error deleting LPO:", error);
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
            {lpos.map((lpo, index) => (
              <tr key={index}>
                <td>{lpo.supplier}</td>
                <td>{lpo.supplierName}</td>
                <td>{lpo.kra_pin}</td>
                <td>{lpo.usd_rate}</td>
                <td>{lpo.lpo_no}</td>
                <td>{lpo.netTotal}</td>
                <td>
                  <button onClick={() => handlePdf(lpo.lpo_no)}>View</button>
                  <button
                    onClick={() => handleDeleteLpo(lpo._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleReceive(lpo.lpo_no)}
                    disabled={lpo.status !== 3}
                    style={{
                      backgroundColor:
                        lpo.status === 3 ? "initial" : "light-gray",
                      cursor: lpo.status === 3 ? "pointer" : "not-allowed",
                    }}
                  >
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
