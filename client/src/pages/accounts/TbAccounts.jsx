import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";
export default function TbAccounts() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();

  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    acc_no: "",
  });

  const [accounts, setAccounts] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/accounts/tbaccounts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userData: user.userData,
        },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }, [accessToken, user.userData]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (accessToken && user) {
      try {
        // Update UI based on submitted data
        setAccounts([...accounts, formData]);

        await axios.post("/api/auth/accounts/tbaccounts", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            userData: user.userData,
          },
        });

        // Clear form data after successful submission
        setFormData({
          account_name: "",
          account_number: "",
          acc_no: "",
        });
      } catch (error) {
        console.error("TB Account not Inserted", error);

        // Revert UI changes to original state if submission fails
        setAccounts(accounts);
      }
    }
  };

  const handleDeleteTBAccount = async (tbaccountId) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this TBAccount?"
      );

      if (confirmation) {
        await axios.delete(`/api/auth/accounts/tbaccounts/${tbaccountId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { userData: user.userData },
        });

        // Update UI directly by filtering accounts array
        setAccounts(accounts.filter((account) => account._id !== tbaccountId));
      }
    } catch (error) {
      console.error("Error deleting TBAccount", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h2>Add Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="account_name" className="form-label">
              Account Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="account_name"
              name="account_name"
              value={formData.account_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="account_number" className="form-label">
              Account Number:
            </label>
            <input
              type="text"
              className="form-control"
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="acc_no" className="form-label">
              Acc No:
            </label>
            <input
              type="text"
              className="form-control"
              id="acc_no"
              name="acc_no"
              value={formData.acc_no}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Account</button>
        </form>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Accounts Created</h2>
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Account Number</th>
              <th>Tb Number</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((tbaccount, index) => (
              <tr key={index}>
                <td>{tbaccount.account_name}</td>
                <td>{tbaccount.account_number}</td>
                <td>{tbaccount.acc_no}</td>
                <td>
                  <button
                    onClick={() => handleDeleteTBAccount(tbaccount._id)}
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
  );
}
