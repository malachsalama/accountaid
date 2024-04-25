import { useState } from "react";
import axios from "axios";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function EditVariables() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(null);

  const [formData, setFormData] = useState({
    company_no: user.userData.company_no,
    vat: "",
    markup_price: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
        company_no: user.userData.company_no,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (accessToken) {
      try {
        await axios.post("/api/auth/edit-variables", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Reset form data
        setFormData({
          company_no: "",
          vat: "",
          markup_price: "",
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
          Variables Edited successfully!
        </div>
      )}
      {isError && <div className="alert alert-danger">{isError}</div>}
      <div className="registration-form">
        <h3>Edit company variables</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company No:</label>
            <input
              type="text"
              className="form-control"
              id="company_no"
              name="company_no"
              value={user.userData.company_no}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="form-label">VAT:</label>
            <input
              type="number"
              className="form-control"
              id="vat"
              name="vat"
              value={formData.vat}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Markup:</label>
            <input
              type="text"
              className="form-control"
              id="markup_price"
              name="markup_price"
              value={formData.markup_price}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
