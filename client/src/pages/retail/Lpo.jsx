import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./retail.css";

function Lpo() {
  const accessToken = useAuthToken();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  console.log(user);

  const [lpoItems, setLpoItems] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  // populating the posts for the lpo details for the LPO
  const [post, setPost] = useState({
    unique_id: "",
    company_no: "",
    description: "",
    quantity: "",
    price: "",
  });

  // populating the formData for the supplier details for the LPO
  const [formData, setFormData] = useState({
    supplier: "",
    supplierName: "",
    kra_pin: "",
    company_no: "",
    usd_rate: "",
    acc_no: "",
    date_created: "",
    vat: "",
  });

  //populates the dropdown menu on typing for the suplier details
  const [suggestions, setSuggestions] = useState([]);
  const [lpoData, setLpo] = useState();

  //function to fetch list of suppliers from the database and set them to the suggestion state above
  const getSuggestions = async (inputValue) => {
    try {
      const response = await axios.get("/api/auth/retail/autocomplete", {
        params: { q: inputValue },
      });

      const data = response.data;
      const filteredData = data.filter((item) => item.company && item.kra_pin);

      setSuggestions(filteredData.map((item) => item.company));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  //capture data selected on to the input fields on the supplier form and sets it to the formData use state.
  const onInputChange = (_, { newValue }) => {
    setFormData((prevData) => ({ ...prevData, supplier: newValue }));
  };

  //handles whatever was selected from the dropdown and sets it to the formData for supplier details
  const onSuggestionSelected = async (_, { suggestionValue }) => {
    const response = await axios.get("/api/auth/retail/autocomplete", {
      params: { q: suggestionValue },
    });

    const data = response.data[0];

    setFormData((prevData) => ({
      ...prevData,
      supplier: suggestionValue,
      supplierName: data.name || "",
      kra_pin: data.kra_pin || "",
      acc_no: data.acc_no || "",
      vat: data.vat || "",
      date_created: data.date_created || "",
    }));
  };

  //capture data keyed in on to the input fields on the supplier form and sets it to the formData use state.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      company_no: user.userData.company_no,
    }));
  };

  const fetchLPODetails = async () => {
    try {
      const lpo = await axios.get("/api/auth/retail/generatelpo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const lpoData = lpo.data;
      setLpo(lpoData);
      //   setLpo((prevData) => ({ ...prevData, lpoData }));
    } catch (error) {
      console.error(error);
    }
  };

  //useeffect to fetch the latest LPO whenever the component mounts
  useEffect(() => {
    fetchLPODetails();
  }, []);

  // takes all formData from supplier form and sends it to the backend for storage.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (accessToken) {
      try {
        await axios.post("/api/auth/retail/generatelpo", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setPost({
          company_no: user.userData.company_no,
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
          // If a validation error response is received
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };

  ///////////////////////////////////////// functions and workflow for lpo details posting///////////////////////////////

  //capture data keyed in on to the input fields on the LPO details form and sets it to the "post" use state.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
        company_no: user.userData.company_no,
      };
    });
  };

  // takes all "post" usestate data from lpo details form and sends it to the backend for storage.
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

        setValidationErrors({});
        fetchLPODetails();

        // Reset the post state to clear the form
        setPost({
          unique_id: "",
          company_no: user.userData.company_no,
          description: "",
          quantity: "",
          price: "",
        });
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

  const handleClose = async (e) => {
    try {
      await axios.post(
        "/api/auth/retail/closelpo",
        {
          lpoUnNo: lpoData.lpo_no,
          company_no: user.userData.company_no,
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

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <h1>Supplier Details</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Supplier:</label>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={({ value }) =>
                  getSuggestions(value)
                }
                onSuggestionsClearRequested={() => setSuggestions([])}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={(suggestion) => suggestion}
                renderSuggestion={(suggestion) => (
                  <div className="suggestion-box-container">{suggestion}</div>
                )}
                inputProps={{
                  value: formData.supplier,
                  onChange: onInputChange,
                  type: "text",
                  className: "form-control",
                  id: "supplier",
                  name: "supplier",
                  required: true,
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Name:</label>
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
              <label className="form-label">Account No:</label>
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
              <label className="form-label">KRA PIN:</label>
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
              <label className="form-label">USD RATE:</label>
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
              <label className="form-label">VAT:</label>
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
              <label className="form-label">Date:</label>
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

          {/* ///////////////////////////////////////////insert LPO details Form////////////////////////////////////////////////////////////////////////// */}

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

              <button type="submit" className="btn btn-primary">
                Create Post
              </button>
            </form>
          </div>
        </div>
        <div className="recent-data-container" style={{ flex: 1 }}>
          <h2>LPO Data</h2>

          <ul>
            {lpoData ? (
              <>
                <li>LPO_No : {lpoData.lpo_no}</li>
                <li>Supplier : {lpoData.supplier}</li>
              </>
            ) : (
              <li>Create Lpo</li>
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
                      <td>{product.price}</td>
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
            Close Lpo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lpo;
