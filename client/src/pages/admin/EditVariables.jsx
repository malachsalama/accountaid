import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function EditVariables() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(null);
  const company_no = user?.userData?.company_no;

  const [formData, setFormData] = useState({
    _id: "",
    company_no: company_no,
    vat: "",
    markup_price: "",
    costing: "",
  });

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await axios.get(
          `/api/auth/get-variables?company_no=${company_no}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const variables = response.data[0];
        if (variables) {
          setFormData({
            _id: variables._id || "",
            company_no: company_no || "",
            vat: variables.vat || "",
            markup_price: variables.markup_price || "",
            costing: variables.costing || "",
          });
        }
      } catch (error) {
        console.error("An error occurred", error);
      }
    };

    if (company_no) {
      fetchVariables();
    }
  }, [company_no, accessToken]);

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

    if (!formData.costing) {
      setIsError("Please choose a costing price.");
      return;
    }

    if (accessToken) {
      try {
        await axios.post("/api/auth/edit-variables", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setIsSuccess(true); // Set state for success message
        setIsError(null); // Clear any previous error messages
      } catch (error) {
        console.error("An error occurred", error);
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
              value={company_no}
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
            <label className="form-label">Markup Price:</label>
            <input
              type="text"
              className="form-control"
              id="markup_price"
              name="markup_price"
              value={formData.markup_price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Costing:</label>
            <select
              className="form-control"
              id="costing"
              name="costing"
              value={formData.costing}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose the costing price
              </option>
              <option value="Latest Cost">Latest Cost</option>
              <option value="Average Cost">Average Cost</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
