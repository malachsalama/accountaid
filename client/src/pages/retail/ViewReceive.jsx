import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Downshift from "downshift";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";

function ViewReceive() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();
  const location = useLocation();
  const lpo = location.state && location.state.lpo;
  const [ReceivedParts, setReceivedParts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [acc_no, setAccNo] = useState(null);
  const [invoiceExists, setInvoiceExists] = useState(false);

  const {
    kra_pin,
    usd_rate,
    lpo_no,
    supplier,
    supplierName,
    vat,
    vatVariable,
  } = lpo[0];

  const [formData, setFormData] = useState({
    kra_pin: kra_pin || "",
    usd_rate: usd_rate || "",
    supplier: supplier || "",
    supplierName: supplierName || "",
    vat: vat || "",
    invoice_no: "",
    date_received: "",
    expense_type: "",
  });

  const fetchAccountsByAccNos = useCallback(
    async (accNos) => {
      if (!user && !user.userData) return;
      try {
        const response = await axios.get("/api/auth/accounts/tbaccounts", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            userData: user.userData,
            acc_no: accNos, // Specify the array of acc_no values to filter by
          },
        });
        const accountsData = response.data.map((item) => ({
          id: item._id,
          name: item.account_name,
        }));
        setAccounts(accountsData);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    },
    [accessToken, user]
  );

  useEffect(() => {
    fetchAccountsByAccNos([1]);
  }, [fetchAccountsByAccNos]);

  useEffect(() => {
    if (lpo && lpo.length > 0) {
      const initialQuantities = {};
      lpo[0].products.forEach((product) => {
        initialQuantities[product._id] = product.quantity;
      });
      setQuantities(initialQuantities);

      setFormData((prevFormData) => ({
        ...prevFormData,
        kra_pin: kra_pin || "",
        usd_rate: usd_rate || "",
        supplier: supplier || "",
        supplierName: supplierName || "",
        vat: vat || "",
        invoice_no: "",
        date_received: "",
      }));
    }
  }, [lpo, kra_pin, usd_rate, supplier, supplierName, vat]);

  const handleCheckboxChange = (lpo_id) => {
    setReceivedParts((prevSelected) => {
      if (prevSelected.includes(lpo_id)) {
        return prevSelected.filter((id) => id !== lpo_id);
      } else {
        return [...prevSelected, lpo_id];
      }
    });
  };

  const handleQuantityChange = (lpo_id, newQuantity) => {
    const initialQuantity = lpo[0].products.find(
      (product) => product._id === lpo_id
    ).quantity;

    if (
      newQuantity === "" ||
      isNaN(newQuantity) ||
      newQuantity <= 0 ||
      newQuantity > initialQuantity
    ) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [lpo_id]: 0,
      }));
      setReceivedParts((prevSelected) =>
        prevSelected.filter((id) => id !== lpo_id)
      );
    } else {
      const newQuantityInt = parseInt(newQuantity);
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [lpo_id]: newQuantityInt,
      }));
      setReceivedParts((prevSelected) => {
        if (!prevSelected.includes(lpo_id)) {
          return [...prevSelected, lpo_id];
        } else {
          return prevSelected;
        }
      });
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "invoice_no") {
      try {
        const response = await axios.get(
          "/api/auth/retail/check-invoice-number",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              invoice_no: value,
            },
          }
        );
        setInvoiceExists(response.data.exists);
      } catch (error) {
        console.error("Error checking invoice number:", error);
      }
    }
  };

  const calculateTotalPrice = () => {
    return ReceivedParts.reduce((acc, id) => {
      const product = lpo[0].products.find((product) => product._id === id);
      const quantity = quantities[id] || product.quantity;
      return acc + product.price * quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const calculateVatAmount = () => {
    if (vat === "N/A") {
      return 0;
    }
    return totalPrice * (vatVariable - 1);
  };

  const calculateTotalWithVat = () => {
    if (vat === "N/A") {
      return totalPrice;
    }
    return totalPrice + calculateVatAmount();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (invoiceExists) {
      alert("Invoice number already exists. Please use a different one.");
      return;
    }

    const finalLpo = {
      ...formData,
      acc_no,
    };

    try {
      await axios.put(
        `/api/auth/retail/generatelpo/${lpo_no}`,
        { ...finalLpo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating LPO:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1" }}>
        <h3>Edit LPO Details({lpo_no})</h3>
        <form onSubmit={handleSubmit}>
          <label>
            KRA PIN:
            <input
              type="text"
              name="kra_pin"
              value={formData.kra_pin}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            USD Rate:
            <input
              type="text"
              name="usd_rate"
              value={formData.usd_rate}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Supplier:
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Supplier Name:
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            VAT:
            <input
              type="text"
              name="vat"
              value={formData.vat}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Invoice Number:
            <input
              type="text"
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleInputChange}
              required
            />
            {invoiceExists && (
              <span style={{ color: "red" }}>
                Invoice number already exists
              </span>
            )}
          </label>
          <br />
          <label>
            Date Received:
            <input
              type="date"
              name="date_received"
              value={formData.date_received}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Type of Expense:
            <select
              name="expense_type"
              value={formData.expense_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Expense Type</option>
              <option value="Capital Expense">Capital Expense</option>
              <option value="Miscellaneous Expense">
                Miscellaneous Expense
              </option>
            </select>
          </label>
          <br />
          <label>
            TB Account:
            <Downshift
              onChange={async (selection) => {
                // Fetch info about the selected account
                try {
                  const response = await axios.get(
                    "/api/auth/accounts/tbaccounts",
                    {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                      params: {
                        userData: user.userData,
                        account_id: selection.id,
                      },
                    }
                  );
                  const acc_no = response.data.acc_no;
                  setAccNo(acc_no);
                } catch (error) {
                  console.error("Error fetching account information:", error);
                }
              }}
              inputValue={inputValue}
              onInputValueChange={(value) => setInputValue(value)}
              itemToString={(item) => (item ? item.name : "")}
            >
              {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
              }) => (
                <div>
                  <input
                    {...getInputProps({ placeholder: "Type a TB Account" })}
                    required
                  />
                  {isOpen ? (
                    <div style={{ border: "1px solid #ccc" }}>
                      {accounts
                        .filter(
                          (item) =>
                            !inputValue ||
                            item.name
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                        )
                        .map((item, index) => (
                          <div
                            key={item.id}
                            {...getItemProps({
                              key: item.id,
                              index,
                              item,
                              style: {
                                backgroundColor:
                                  highlightedIndex === index
                                    ? "lightgray"
                                    : "white",
                                fontWeight:
                                  selectedItem === item ? "bold" : "normal",
                              },
                            })}
                          >
                            {item.name}
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              )}
            </Downshift>
          </label>
          <br />

          <button type="submit">Submit</button>
        </form>
      </div>
      <div style={{ flex: "2" }}>
        <h2>Received LPO Data</h2>
        {lpo && lpo.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Unique ID</th>
                <th>Company Number</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Final Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {lpo[0].products.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(item._id)}
                      checked={ReceivedParts.includes(item._id)}
                    />
                  </td>
                  <td>{item.unique_id}</td>
                  <td>{item.company_no}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <input
                      type="number"
                      value={quantities[item._id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                      min="0"
                      max={item.quantity}
                    />
                  </td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
        <div>
          <p>Net: {totalPrice.toFixed(2)}</p>
          <p>Vat: {calculateVatAmount().toFixed(2)}</p>
          <p>Total: {calculateTotalWithVat().toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default ViewReceive;
