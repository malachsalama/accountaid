import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./retail.css";

const LpoDetails = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplier: "",
    supplierName: "",
    kra_pin: "",
    usd_rate: "",
    lpo_no: "",
    acc_no: "",
    date_created: "",
    vat: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const jwtToken = user ? user.accessToken : null;

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

  const onInputChange = (_, { newValue }) => {
    setFormData((prevData) => ({ ...prevData, supplier: newValue }));
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchLpoItems = useCallback(async () => {
    try {
      await axios.get("/api/auth/retail/createlpo", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [jwtToken]);

  useEffect(() => {
    if (user) {
      fetchLpoItems();
    }
  }, [fetchLpoItems, user]);

  useEffect(() => {
    const fetchAccNo = async () => {
      try {
        const response = await axios.get("/api/auth/retail/lpo_no");
        const lpo_no = response.data;
        setFormData((prevData) => ({ ...prevData, lpo_no }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccNo();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (user) {
      try {
        await axios.post("/api/auth/retail/generatelpo", formData, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        navigate("/retail/lpolist");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // If a validation error response is received
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };

  return (
    <div className="registration-form">
      <h1>Supplier Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Supplier:</label>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={({ value }) => getSuggestions(value)}
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
    </div>
  );
};

export default LpoDetails;
