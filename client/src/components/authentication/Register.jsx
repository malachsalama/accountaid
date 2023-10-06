import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./auth.css";

export default function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    phone_no: "",
    department: "",
    designation: "",
    department_no: "",
    user_id: "",
    password: "",
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      setIsLoading(true);
      setError(null);
      // Send a POST request using Axios
      const response = await axios.post(`/api/auth/user/signup`, formData);

      const data = response.data;

      if (response.status === 201) {
        // Save the user to local storage
        localStorage.setItem("user", JSON.stringify(data));

        // Update the Auth context
        dispatch({ type: "LOGIN", payload: data });

        setIsLoading(false);
        // You can also redirect the user to a success page or perform other actions here
      } else {
        // Handle registration error
        setIsLoading(false);
        setError(error);
        console.error("Registration failed");
        // You can display an error message to the user
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/auth/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("An error occurred while fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="registration-form">
      <h1>User Registration</h1>
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
            onChange={handleChange}
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.department}>
                {dept.department}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Designation:</label>
          <input
            type="text"
            className="form-control"
            id="designation"
            name="designation"
            value={formData.designation}
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
      </form>
    </div>
  );
}
