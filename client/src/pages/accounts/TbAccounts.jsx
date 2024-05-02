import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";
export default function TbAccounts() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();
  // State to store form data
  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    acc_no: "",
  });
  const company_no = user?.userData?.company_no;

  // State to store accounts created
  const [accounts, setAccounts] = useState([]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchAccounts();
  });

  // Function to fetch accounts data from the database
  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/api/auth/accounts/tbaccounts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          company_no: company_no,
        },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (accessToken && user) {
      try {
        // setIsLoading(true);
        // setError(null);
        const response = await axios.post(
          "/api/auth/accounts/tbaccounts",
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              company_no: company_no,
            },
          }
        );

        // Fetch updated accounts data after submission
        fetchAccounts();

        // Reset form data
        setFormData({
          account_name: "",
          account_number: "",
          acc_no: "",
        });

        if (response.status === 201) {
          console.log(response);
        }
      } catch (error) {
        console.error("TB Account not Inserted", error);
      }
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
            {accounts.map((account, index) => (
              <tr key={index}>
                <td>{account.account_name}</td>
                <td>{account.account_number}</td>
                <td>{account.acc_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
