import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import "./retail.css";

function CreateLpo() {
  const { user } = useAuthContext();
  const [lpoItems, setLpoItems] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const [post, setPost] = useState({
    unique_id: "",
    description: "",
    quantity: "",
    price: "",
  });

  const accessToken = user ? user.accessToken : null;

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
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLpoItems(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [accessToken]);

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
            Authorization: `Bearer ${accessToken}`,
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
    <div>
      <div className="lpo-form">
        <h1 className="form-title">Create LPO</h1>
        <form onSubmit={handleClick}>
          <div className="form-group">
            <label htmlFor="unique_id" className="form-label">
              Unique ID:
            </label>
            <input
              type="text"
              className="form-control"
              name="unique_id"
              value={post.unique_id}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={post.description}
              onChange={handleChange}
            />
          </div>
          {validationErrors.description && (
            <div className="error">{validationErrors.description.message}</div>
          )}

          <div className="form-geoup">
            <label htmlFor="quantity" className="form-label">
              Quantity:
            </label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={post.quantity}
              onChange={handleChange}
            />
          </div>
          {validationErrors.quantity && (
            <div className="error">{validationErrors.quantity.message}</div>
          )}
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price:
            </label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={post.price}
              onChange={handleChange}
            />
          </div>
          {validationErrors.price && (
            <div className="error">{validationErrors.price.message}</div>
          )}

          <button type="submit" className="btn btn-primary">
            Create Post
          </button>
        </form>
      </div>

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
            {lpoItems.map((item, index) => (
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
