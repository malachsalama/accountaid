import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import "./retail.css";

function CreateLpo() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [lpoItems1, setLpoItems] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const [post, setPost] = useState({
    unique_id: "",
    description: "",
    quantity: "",
    price: "",
  });

  const jwtToken = user ? user.token : null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Function to fetch LPO items with Authorization header
  const fetchLpoItems = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/retail/createlpo", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setLpoItems(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [jwtToken]);

  useEffect(() => {
    if (user) {
      fetchLpoItems();
    }
  }, [fetchLpoItems, user]);

  const handleClick = async (event) => {
    event.preventDefault();

    if (user) {
      try {
        await axios.post("/api/auth/retail/createlpo", post, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setValidationErrors({});
        fetchLpoItems();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // If a validation error response is received
          setValidationErrors(error.response.data.errors);
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto auto", textAlign: "center" }}>
      <h1>Create LPO</h1>
      <Form>
        <Form.Group>
          <div className="form_lpo">
            <Form.Control
              className="form_input-field"
              name="unique_id"
              value={post.unique_id}
              placeholder="Unique Number"
              style={{ marginBottom: "1rem" }}
              onChange={handleChange}
            />

            <Form.Control
              className="form_input-field"
              name="description"
              value={post.description}
              placeholder="Description"
              style={{ marginBottom: "1rem" }}
              onChange={handleChange}
            />
            {validationErrors.description && (
              <div className="error">
                {validationErrors.description.message}
              </div>
            )}
          </div>
          <div className="form_lpo">
            <Form.Control
              className="form_input-field"
              name="quantity"
              value={post.quantity}
              placeholder="Quantity"
              style={{ marginBottom: "1rem" }}
              onChange={handleChange}
            />
            {validationErrors.quantity && (
              <div className="error">{validationErrors.quantity.message}</div>
            )}
            <Form.Control
              className="form_input-field"
              name="price"
              value={post.price}
              placeholder="Price"
              style={{ marginBottom: "1rem" }}
              onChange={handleChange}
            />
            {validationErrors.price && (
              <div className="error">{validationErrors.price.message}</div>
            )}
          </div>
        </Form.Group>

        <Button
          variant="outline-success"
          style={{ width: "10%", marginBottom: "1rem" }}
          onClick={handleClick}
        >
          Create Post
        </Button>
      </Form>
      <Button
        variant="outline-dark"
        style={{ width: "10%" }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <div className="table-container">
        <table className="lpo-table">
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {lpoItems1.map((item, index) => (
              <tr key={index}>
                <td>{item.unique_id}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/retail/lpodetails">Submit</Link>
    </div>
  );
}

export default CreateLpo;
