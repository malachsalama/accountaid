/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";
import "../../components/authentication/auth.css";

export default function CreateCreditor() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    kra_pin: "",
    email: "",
    phone_no: "",
    acc_no: "",
  });

  const [creditors, setCreditors] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch account number for the latest creditor in the DB
  async function fetchAccountNo() {
    try {
      const response = await axios.get("/api/auth/accounts/account_no", {
        params: {
          userData: user.userData,
        },
      });
      const acc_no = response.data;
      setFormData((prevData) => ({ ...prevData, acc_no }));
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCreditors() {
    const response = await axios.get("/api/auth/accounts/creditors", {
      params: { userData: user.userData },
    });
    setCreditors(response.data);
  }

  useEffect(() => {
    fetchCreditors();
    fetchAccountNo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        setIsLoading(true);
        setError(null);

        await axios.post("/api/auth/accounts/createcreditor", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            userData: user.userData,
          },
        });

        fetchAccountNo();
        fetchCreditors();

        // Clear the form fields except for the account number
        setFormData({
          name: "",
          company: "",
          kra_pin: "",
          email: "",
          phone_no: "",
          acc_no: formData.acc_no,
        });
      } catch (error) {
        setIsLoading(false);
        setError("Creditor not Inserted");
        console.error("Creditor not Inserted", error);
      }
    }
  };

  const handleDeleteCreditor = async (creditorId) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this creditor?"
      );

      if (confirmation) {
        await axios.delete(`/api/auth/accounts/creditors/${creditorId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { userData: user.userData },
        });

        fetchAccountNo();
        fetchCreditors();
      }
    } catch (error) {
      console.error("Error deleting creditor", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <div className="registration-form">
          <h2>Register Creditor</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Acc_no:</label>
              <input
                type="text"
                className="form-control"
                id="acc_no"
                name="acc_no"
                value={formData.acc_no}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company:</label>
              <input
                type="text"
                className="form-control"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">KRA PIN:</label>
              <input
                type="text"
                className="form-control"
                id="kra_pin"
                name="kra_pin"
                value={formData.kra_pin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone_No:</label>
              <input
                type="text"
                className="form-control"
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              Register
            </button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Here are our Creditors</h2>
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
                  <td>
                    <button
                      onClick={() => handleDeleteCreditor(creditor._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
