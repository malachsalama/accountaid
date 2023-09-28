import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request using Axios
      const response = await axios.post(`/api/auth/user/signup`, formData);

      if (response.status === 201) {
        console.log("User registered successfully");
        // You can also redirect the user to a success page or perform other actions here
      } else {
        // Handle registration error
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
    <div>
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone_no">Phone Number:</label>
          <input
            type="text"
            id="phone_no"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="department">Department:</label>
          <select
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
        <div>
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="department_no">Department Number:</label>
          <input
            type="text"
            id="department_no"
            name="department_no"
            value={formData.department_no}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="user_id">User ID:</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
