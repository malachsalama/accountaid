import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { useAuthContext } from "../../hooks/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, error, isLoading } = useLogin();
  const { user } = useAuthContext();

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the login function to send the POST request
    try {
      await login(formData);
    } catch (error) {
      console.error("Login failed.");
    }
  };

  // If user data contains the department, navigate accordingly
  useEffect(() => {
    if (user && user.userData && user.userData.department) {
      const { department } = user.userData;
      switch (department) {
        case "Management":
          navigate("/admin");
          break;
        case "Retail":
          navigate("/retail");
          break;
        case "Accounts":
          navigate("/accounts");
          break;
        case "Human Resource":
          navigate("/humanresource");
          break;
        case "SUPERADMIN":
          navigate("/superadmin");
          break;
        default:
          // Navigate to a default page if department doesn't match any case
          navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="login-form">
      <h1 className="form-title">Login</h1>
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
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </span>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Login
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
