import { useState } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function LpoDetails() {
  const { user } = useAuthContext();
  const [value, setValue] = useState("");
  const [kra_pin, setKraPin] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [post, setPost] = useState({
    usd_rate: "",
  });

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
        if (data.name || data.kra_pin) {
          names.push(data.name);
          kra_pins.push(data.kra_pin);
        }
      });

      setSuggestions(names);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const onInputChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionSelected = async (event, { suggestionValue }) => {
    setValue(suggestionValue);

    const response = await axios.get("/api/auth/retail/autocomplete", {
      params: { q: suggestionValue },
    });

    const data = response.data;

    setKraPin(data[0].kra_pin);
  };

  const renderSuggestion = (suggestion) => (
    <div className="suggestion-box">{suggestion}</div>
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleClick = async (event) => {
    event.preventDefault();

    if (user) {
      try {
        await axios.post("/api/auth/retail/createLpoFinal", post, {
          headers: {
            Authorization: `Bearer ${jwtToken}, value, kra_pin`,
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

  return (
    <div className="registration-form">
      <h1>Creditor Details</h1>
      <form>
        <div className="form-group">
          <label className="form-label">Creditor:</label>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={({ value }) => getSuggestions(value)}
            onSuggestionsClearRequested={() => setSuggestions([])}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={renderSuggestion}
            inputProps={{
              value,
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
          <label className="form-label">KRA PIN:</label>
          <input
            type="text"
            className="form-control"
            id="kra_pin"
            name="kra_pin"
            defaultValue=""
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
            value={post.usd_rate}
            required
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" onClick={handleClick}>
          Create LPO
        </button>
      </form>
    </div>
  );
}
