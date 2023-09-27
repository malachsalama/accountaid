import { useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

import { Navigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request using Axios
      const response = await axios.post(`/api/auth/user/login`, formData);

      if (response.status === 200) {
        console.log("User logged in successfully");
        Navigate("/home");
      } else {
        // Handle login error
        console.error("Login failed");
        Navigate("/");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
