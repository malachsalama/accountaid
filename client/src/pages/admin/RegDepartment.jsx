import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";

export default function RegDepartment() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(null);
  const company_no = user?.userData?.company_no;

  const [formData, setFormData] = useState({
    department: "",
    department_no: "",
    designations: [], // Store an array of designations
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

  const handleAddDesignation = () => {
    setFormData((prev) => {
      return {
        ...prev,
        designations: [...prev.designations, ""], // Add an empty string for a new designation
      };
    });
  };

  const handleDesignationChange = (index, value) => {
    setFormData((prev) => {
      const updatedDesignations = [...prev.designations];
      updatedDesignations[index] = value;
      return {
        ...prev,
        designations: updatedDesignations,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (accessToken && user) {
      try {
        await axios.post("/api/auth/add-department", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            company_no: company_no,
          },
        });

        // Reset form data
        setFormData({
          department: "",
          department_no: "",
          designations: [],
        });
        setIsSuccess(true); // Set state for success message
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
          Department registered successfully!
        </div>
      )}
      {isError && <div className="alert alert-danger">{isError}</div>}
      <div className="registration-form">
        <h3>Register Department</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Department Name:</label>
            <input
              type="text"
              className="form-control"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department Number:</label>
            <input
              type="text"
              className="form-control"
              id="department_no"
              name="department_no"
              value={formData.department_no}
              onChange={handleChange}
              required
            />
          </div>

          {/* Map through designations array to render input fields */}
          {formData.designations.map((designation, index) => (
            <div className="form-group" key={index}>
              <label className="form-label">Designation {index + 1}:</label>
              <input
                type="text"
                className="form-control"
                value={designation}
                onChange={(e) => handleDesignationChange(index, e.target.value)}
                required
              />
            </div>
          ))}

          {/* Button to add a new designation field */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddDesignation}
          >
            Add Designation
          </button>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
