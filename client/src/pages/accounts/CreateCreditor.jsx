import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../components/authentication/auth.css";

export default function CreateCreditor() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    kra_pin: "",
    email: "",
    phone_no: "",
    acc_no: "",
  });
  const jwtToken = user ? user.token : null;

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  // uses usestate to store data keyed into the form fields by the user
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        // setIsLoading(true);
        // setError(null);
        const response = await axios.post(
          "/api/auth/accounts/createcreditor",
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.status === 201) {
          navigate("/creditorlist");
        }
      } catch (error) {
        setIsLoading(false);
        setError("Creditor not Inserted"); // Set the error message
        console.error("Creditor not Inserted", error);
      }
    }
  };

  useEffect(() => {
    const fetchAccNo = async () => {
      try {
        const response = await axios.get("/api/auth/accounts/account_no");
        let acc_no = response.data;
        setFormData({ ...formData, acc_no });
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccNo();
  }, [formData]);

  return (
    <div className="registration-form">
      <h1>Register Creditor</h1>
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

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Register
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
