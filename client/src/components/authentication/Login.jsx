import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });
  const { login, error, isLoading } = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the login function to send the POST request
    try {
      const success = await login(formData);
      if (success) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const department = user?.user?.department;

          if (department === "Management") {
            navigate("/admin");
          } else if (department === "Retail") {
            navigate("/retail");
          } else if (department === "Accounts") {
            navigate("/accounts");
          } else if (department === "Human Resource") {
            navigate("/humanresource");
          }
        } else {
          console.error("The user object is not set in the localStorage.");
        }
      }
    } catch (error) {
      console.error("Login failed.");
    }
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_id" className="form-label">
            User ID:
          </label>
          <input
            type="text"
            id="user_id"
            className="form-control"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Login
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
}
