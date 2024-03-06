import { useState } from "react";
import axios from "axios";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function RegCompany() {
  const accessToken = useAuthToken();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    company_no: "",
    kra_pin: "",
    email: "",
    phone_no: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (accessToken) {
      try {
        await axios.post("/api/auth/superadmin/reg-company", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Reset form data
        setFormData({
          company_name: "",
          company_no: "",
          kra_pin: "",
          email: "",
          phone_no: "",
        });
        setIsSuccess(true); // Set state for success message
      } catch (error) {
        console.error("An error occured", error);
        setIsError(error.message);
      }
    }
  };

  return (
    <>
      {isSuccess && (
        <div className="alert alert-success">
          Company registered successfully!
        </div>
      )}
      {isError && <div className="alert alert-danger">{isError}</div>}
      <div className="registration-form">
        <h3>Register New Company</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company Name:</label>
            <input
              type="text"
              className="form-control"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company No:</label>
            <input
              type="text"
              className="form-control"
              id="company_no"
              name="company_no"
              value={formData.company_no}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Kra Pin:</label>
            <input
              type="text"
              className="form-control"
              id="kra_pin"
              name="kra_pin"
              value={formData.kra_pin}
              onChange={handleChange}
              required
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

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
