import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCombobox } from "downshift";
import "./retail.css";

function Lpo() {
  const accessToken = useAuthToken();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // State for supplier form
  const [formData, setFormData] = useState({
    supplier: "",
    supplierName: "",
    kra_pin: "",
    usd_rate: "",
    acc_no: "",
    date_created: "",
    vat: "",
  });

  // State for LPO details form
  const [post, setPost] = useState({
    unique_id: "",
    description: "",
    quantity: "",
    price: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [lpoData, setLpo] = useState();
  const [error, setError] = useState(null);

  const getSuggestions = async (inputValue) => {
    try {
      const response = await axios.get("/api/auth/retail/autocomplete", {
        params: { q: inputValue, userData: user.userData },
      });
      const suggestedSuppliers = response.data;
      const supplierNames = suggestedSuppliers.map(
        (supplier) => supplier.creditor_name
      );
      setSuggestions(supplierNames);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectedItemChange = async ({ selectedItem }) => {
    if (selectedItem) {
      const response = await axios.get("/api/auth/retail/autocomplete", {
        params: { q: selectedItem, userData: user.userData },
      });
      const data = response.data[0];
      setFormData((prevData) => ({
        ...prevData,
        supplier: selectedItem,
        supplierName: data.name || "",
        kra_pin: data.kra_pin || "",
        acc_no: data.acc_no || "",
        vat: data.vat || "",
        date_created: data.date_created || "",
      }));
    }
  };

  const handleInputValueChange = ({ inputValue }) => {
    setFormData((prevData) => ({ ...prevData, supplier: inputValue }));
    if (inputValue) {
      getSuggestions(inputValue);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      company_no: user.userData.company_no,
    }));
  };

  const fetchLPODetails = useCallback(async () => {
    if (user && user.userData) {
      try {
        const response = await axios.get("/api/auth/retail/fetchlpodata", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            company_no: user.userData.company_no,
          },
        });
        if (response.status === 204) {
          setError("No LPO initiated!");
          setLpo(null);
        } else {
          setLpo(response.data);
          setError(null); // Clear any previous errors
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          // If response has an error message, use that
          setError(error.response.data.error);
        } else {
          // Otherwise, use the default error message
          setError(error.message);
        }
      }
    }
  }, [accessToken, user]);

  useEffect(() => {
    fetchLPODetails();
  }, [fetchLPODetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (accessToken) {
      try {
        await axios.post("/api/auth/retail/generatelpo", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            userData: user.userData,
          },
        });
        setFormData({
          supplier: "",
          supplierName: "",
          kra_pin: "",
          usd_rate: "",
          acc_no: "",
          date_created: "",
          vat: "",
        });
        fetchLPODetails();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Handle validation error
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
      company_no: user.userData.company_no,
    }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (accessToken) {
      try {
        await axios.post("/api/auth/retail/postlpodetails", post, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            lpoUnNo: lpoData.lpo_no,
          },
        });
        fetchLPODetails();
        setPost({
          unique_id: "",
          description: "",
          quantity: "",
          price: "",
        });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  const handleClose = async () => {
    try {
      await axios.post(
        "/api/auth/retail/closelpo",
        {
          lpoUnNo: lpoData.lpo_no,
          userData: user.userData,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      navigate("/retail/lpolist");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: suggestions,
    onSelectedItemChange: handleSelectedItemChange,
    onInputValueChange: handleInputValueChange,
  });

  return (
    <>
      <div>
        <div className="lpo-top">
          <div className="lpo-supplier-details-form">
            <h1>Supplier Details</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="supplier" className="form-label">
                  Supplier:
                </label>
                <input
                  {...getInputProps({
                    type: "text",
                    className: "form-control",
                    id: "supplier",
                    name: "supplier",
                    required: true,
                  })}
                />
                <ul {...getMenuProps()} className="suggestion-box">
                  {isOpen &&
                    suggestions.map((item, index) => (
                      <li
                        {...getItemProps({ item, index })}
                        key={index}
                        className={
                          highlightedIndex === index ? "highlighted-item" : ""
                        }
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="form-group">
                <label htmlFor="supplierName" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="supplierName"
                  name="supplierName"
                  value={formData.supplierName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="acc_no" className="form-label">
                  Account No:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="acc_no"
                  name="acc_no"
                  value={formData.acc_no || ""}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="kra_pin" className="form-label">
                  KRA PIN:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="kra_pin"
                  name="kra_pin"
                  value={formData.kra_pin || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="usd_rate" className="form-label">
                  USD RATE:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="usd_rate"
                  name="usd_rate"
                  value={formData.usd_rate || ""}
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="vat" className="form-label">
                  VAT:
                </label>
                <select
                  className="form-control"
                  id="vat"
                  name="vat"
                  value={formData.vat || ""}
                  required
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Inc">Inc</option>
                  <option value="Exc">Exc</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date_created" className="form-label">
                  Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date_created"
                  name="date_created"
                  value={formData.date_created || ""}
                  required
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Create LPO
              </button>
            </form>
          </div>

          <div className="lpo-initiated-data">
            <h2>LPO Data</h2>
            <ul>
              {lpoData ? (
                <>
                  <li>LPO_No : {lpoData.lpo_no}</li>
                  <li>Supplier : {lpoData.supplier}</li>
                </>
              ) : (
                <div>{error}</div>
              )}
              {lpoData && lpoData.products && lpoData.products.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lpoData.products.map((product, index) => (
                      <tr key={index}>
                        <td>{product.unique_id}</td>
                        <td>{product.description}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ul>
            <button
              onClick={handleClose}
              className="btn btn-primary"
              disabled={!lpoData || !lpoData.lpo_no}
            >
              Close LPO
            </button>
          </div>
        </div>

        <div className="lpo-creation-form">
          <h1 className="form-title">Create LPO</h1>
          <form onSubmit={handleClick}>
            <div className="form-group">
              <label htmlFor="unique_id" className="form-label">
                Unique ID:
              </label>
              <input
                type="text"
                className="form-control"
                id="unique_id"
                name="unique_id"
                value={post.unique_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={post.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Quantity:
              </label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                value={post.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price:
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={post.price}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Lpo;
