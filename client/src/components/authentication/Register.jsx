import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

export default function Registration() {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    username: "",
    phone_no: "",
    department: "",
    designation: "",
    department_no: "",
    company_no: "",
    user_id: "",
    password: "",
  });
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const company_no = user?.userData?.company_no;

  // Update formData when user object changes
  useEffect(() => {
    if (user && user.userData) {
      setFormData((prevState) => ({
        ...prevState,
        company_no: company_no,
      }));
    }
  }, [user, company_no]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      company_no: company_no,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(`/api/auth/user/signup`, formData);

      if (response.status === 201) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError("A user with the same User ID already exists");
      console.error("An error occurred: ", error);
    }
  };

  useEffect(() => {
    if (!isLoading && !error) {
      setFormData({
        username: "",
        phone_no: "",
        department: "",
        designation: "",
        department_no: "",
        user_id: "",
        password: "",
      });
    }
  }, [isLoading, error]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `/api/auth/departments?company_no=${company_no}`
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("An error occurred while fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [company_no]);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchDesignations = async () => {
        try {
          const response = await axios.get(
            `/api/auth/designations?company_no=${company_no}&department=${selectedDepartment}`
          );
          setDesignations(response.data);
        } catch (error) {
          console.error(
            "An error occurred while fetching designations:",
            error
          );
        }
      };

      fetchDesignations();
    }
  }, [selectedDepartment, company_no]);

  return (
    <div className="registration-form">
      <h1 className="form-title">User Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number:</label>
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
        <div className="form-group">
          <label className="form-label">Department:</label>
          <select
            className="form-control"
            id="department"
            name="department"
            value={formData.department}
            onChange={(e) => {
              handleChange(e);
              setSelectedDepartment(e.target.value); // Update selectedDepartment when department changes
            }}
            required
          >
            <option key="" value="">
              Select a department
            </option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Designation:</label>
          <select
            className="form-control"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option key="" value="">
              Select a designation
            </option>
            {designations.map((desg, index) => (
              <option key={index} value={desg}>
                {desg}
              </option>
            ))}
          </select>
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

        <div className="form-group">
          <label className="form-label">User ID:</label>
          <input
            type="text"
            className="form-control"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
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
