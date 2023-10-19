import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function LpoDetails() {
  const { user } = useAuthContext();
  const [supplier, setSupplier] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [kra_pin, setKraPin] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [usd_rate, setUsdRate] = useState("");

  const jwtToken = user ? user.token : null;

  const getSuggestions = async (inputValue) => {
    try {
      const response = await axios.get("/api/auth/retail/autocomplete", {
        params: { q: inputValue },
      });

      const data = response.data;

      const names = [];
      const kra_pins = [];

      data.forEach((data) => {
        if (data.company || data.kra_pin) {
          names.push(data.company);
          kra_pins.push(data.kra_pin);
        }
      });

      setSuggestions(names);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const onInputChange = (event, { newValue }) => {
    setSupplier(newValue);
  };

  const onSuggestionSelected = async (event, { suggestionValue }) => {
    const response = await axios.get("/api/auth/retail/autocomplete", {
      params: { q: suggestionValue },
    });

    const data = response.data;

    setKraPin(data[0].kra_pin);
    setSupplierName(data[0].name);
    setSupplier(suggestionValue);
  };

  const renderSuggestion = (suggestion) => (
    <div className="suggestion-box">{suggestion}</div>
  );

  const handleUsdRate = (event) => {
    const usd_rate = event.target.value;
    setUsdRate(usd_rate);
  };

  const handleKraPinChange = (event) => {
    const kraPin = event.target.value;
    setKraPin(kraPin);
  };

  const handleSupplier = (event) => {
    const supplierName = event.target.value;
    setSupplierName(supplierName);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (user) {
      try {
        // Include value and kra_pin in the request body
        const data = {
          supplier,
          supplierName,
          kra_pin,
          usd_rate,
        };

        await axios.post("/api/auth/retail/createLpoFinal", data, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // If a validation error response is received
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };


  // Function to fetch LPO items with Authorization header
  const fetchLpoItems = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/retail/createlpo", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const lpoItems = response.data;

      // Calculate total for each item and accumulate the overall total
      let overallTotal = 0;
      lpoItems.forEach((lpoItem) => {
        const total = lpoItem.quantity * lpoItem.price;
        overallTotal += total;
      });

      // Do something with the calculated totals (e.g., display them)
      console.log("Overall Total: ", overallTotal);
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
        let lpo_no = response.data;
        // setFormData({ ...formData, acc_no });
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccNo();
  }, []);


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
            renderSuggestion={renderSuggestion}
            inputProps={{
              value: supplier,
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
            value={supplierName}
            onChange={handleSupplier}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">KRA PIN:</label>
          <input
            type="text"
            className="form-control"
            id="kra_pin"
            name="kra_pin"
            value={kra_pin}
            onChange={handleKraPinChange}
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
            value={usd_rate}
            required
            onChange={handleUsdRate}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create LPO
        </button>
      </form>
    </div>
  );
}
