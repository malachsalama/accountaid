import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeJWT } from "../../../utils/jwtUtils";

axios.defaults.baseURL = "http://localhost:8000";

export default function Login() {
  const navigate = useNavigate();
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
        // Assuming the server responds with a JWT token upon successful login
        const token = response.data.token;

        // Store the token in session storage
        sessionStorage.setItem("authToken", token);

        // Redirect to the "/home" route
        navigate("/home");
      } else {
        // Handle login error
        console.error("Login failed");
      }
    } catch (error) {
      navigate("/");
      console.error("An error occurred", error);
    }
  };

  useEffect(() => {
    // Retrieve the token from session storage (if it exists)
    const authToken = sessionStorage.getItem("authToken");

    // If a token exists, you can check its contents (e.g., roles) using decodeJWT
    if (authToken) {
      const decodedToken = decodeJWT(authToken);
      console.log("Decoded Token:", decodedToken);
    }
  }, []);

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
