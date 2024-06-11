import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Downshift from "downshift";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAuthToken } from "../../hooks/useAuthToken";
import "./retail.css";

function ViewReceive() {
  const { user } = useAuthContext();
  const accessToken = useAuthToken();
  const location = useLocation();
  const navigate = useNavigate();
  const lpo = location.state && location.state.lpo;
  const [ReceivedParts, setReceivedParts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [TBAccount_name, setTBAccountName] = useState(null);
  const [TBAccount_no, setTBAccountNo] = useState(null);
  const [grnNo, setGrnNo] = useState("");
  const [invoiceExists, setInvoiceExists] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const {
    kra_pin,
    usd_rate,
    lpo_no,
    supplier,
    supplierName,
    vat,
    vatVariable,
  } = lpo[0];

  const company_no = user.userData.company_no;

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

  const fetchAccountNumber = async () => {
    try {
      const response = await axios.get("/api/auth/accounts/account_no", {
        params: {
          userData: {
            company_no: company_no,
            account_name: supplierName,
          },
        },
      });

      setAccountNumber(response.data);
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  };

  const fetchGRNNo = async (company_no) => {
    try {
      const response = await axios.get("/api/auth/accounts/grn_no", {
        params: { company_no },
      });
      const grn_no = response.data;

      setGrnNo(grn_no);
    } catch (error) {
      console.error("Error fetching GRN number:", error);
      return null;
    }
  };

  useEffect(() => {
    if (company_no) {
      fetchGRNNo(company_no);
    }
  }, [company_no]);

  const fetchAccountsByAccNos = useCallback(
    async (accNos) => {
      try {
        if (!user && !user.userData) return;
        const response = await axios.get("/api/auth/accounts/tbaccounts", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            userData: user.userData,
            acc_no: accNos,
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
      const newSelected = prevSelected.includes(lpo_id)
        ? prevSelected.filter((id) => id !== lpo_id)
        : [...prevSelected, lpo_id];
      return newSelected;
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
      const newSelected = ReceivedParts.includes(lpo_id)
        ? ReceivedParts
        : [...ReceivedParts, lpo_id];
      setReceivedParts(newSelected);
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
              company_no,
            },
          }
        );
        setInvoiceExists(response.data.exists);
      } catch (error) {
        console.error("Error checking invoice number:", error);
      }
    }
  };

  const calculateNetAmount = useCallback(() => {
    return ReceivedParts.reduce((acc, id) => {
      const product = lpo[0].products.find((product) => product._id === id);
      const quantity = quantities[id] || product.quantity;
      return acc + product.price * quantity;
    }, 0);
  }, [ReceivedParts, lpo, quantities]);

  const calculateVatAmount = useCallback(
    (netAmount) => {
      if (vat === "N/A") {
        return 0;
      }
      return netAmount * (vatVariable - 1);
    },
    [vat, vatVariable]
  );

  const calculateTotalAmount = useCallback(
    (netAmount, vatAmount) => {
      if (vat === "N/A") {
        return netAmount;
      }
      return netAmount + vatAmount;
    },
    [vat]
  );

  const updateLpoDetails = async (formData, lpoStatus) => {
    try {
      // Construct the update payload with only the fields that need to be updated
      const updatePayload = {
        TBAccount_name,
        grn_no: grnNo,
        status: lpoStatus,
        ...formData,
      };

      // Perform the partial update using PATCH
      await axios.patch(`/api/auth/retail/updatelpo/${lpo_no}`, updatePayload, {
        params: { company_no },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error updating LPO details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (invoiceExists) {
      alert("Invoice number already exists. Please use a different one.");
      return;
    }

    await fetchAccountNumber();
    await fetchGRNNo(company_no);

    // Update LPO details
    await updateLpoDetails(formData, 2);

    // Show table after successful form submission
    setShowTable(true);
  };

  const updateTableData = useCallback(() => {
    const netAmount = calculateNetAmount();
    const vatAmount = calculateVatAmount(netAmount);
    const totalAmount = calculateTotalAmount(netAmount, vatAmount);

    const newTableData = [
      {
        account_name: supplierName,
        account_number: accountNumber,
        type: "credit",
        usd_rate: formData.usd_rate,
        date: formData.date_received,
        narration: grnNo,
        doc_ref: formData.invoice_no,
        amount: totalAmount.toFixed(2),
        created_at: new Date().toISOString().split("T")[0],
      },
      {
        account_name: TBAccount_name,
        account_number: TBAccount_no,
        type: "debit",
        usd_rate: formData.usd_rate,
        date: formData.date_received,
        narration: grnNo,
        doc_ref: formData.invoice_no,
        amount: netAmount.toFixed(2),
        created_at: new Date().toISOString().split("T")[0],
      },
      {
        account_name: "vat_input",
        account_number: "vat_1",
        type: "debit",
        usd_rate: formData.usd_rate,
        date: formData.date_received,
        narration: grnNo,
        doc_ref: formData.invoice_no,
        amount: vatAmount.toFixed(2),
        created_at: new Date().toISOString().split("T")[0],
      },
    ];

    setTableData(newTableData);
  }, [
    TBAccount_name,
    TBAccount_no,
    grnNo,
    supplierName,
    formData.usd_rate,
    formData.date_received,
    formData.invoice_no,
    calculateNetAmount,
    calculateTotalAmount,
    calculateVatAmount,
    accountNumber,
  ]);

  useEffect(() => {
    if (showTable) {
      updateTableData();
    }
  }, [ReceivedParts, quantities, TBAccount_name, updateTableData, showTable]);

  const handleFinalSubmit = async () => {
    try {
      if (!formData.invoice_no || !formData.date_received) {
        alert("Please fill in the invoice number and date received.");
        return;
      }

      if (!TBAccount_name) {
        alert("Please select an expense type.");
        return;
      }

      if (ReceivedParts.length === 0) {
        alert("Please select at least one product.");
        return;
      }

      // Update LPO details with status 4
      await updateLpoDetails(formData, 4);

      // Calculate amounts
      const netAmount = calculateNetAmount();
      const vatAmount = calculateVatAmount(netAmount);
      const totalAmount = calculateTotalAmount(netAmount, vatAmount);

      // Extract the parts to be added to stock
      const receivedPartsData = ReceivedParts.map((partId) => {
        const part = lpo[0].products.find((p) => p._id === partId);
        return {
          unique_id: part.unique_id,
          company_no: part.company_no,
          description: part.description,
          quantity: quantities[partId] || 0,
          price: part.price,
          date_received: formData.date_received,
        };
      });

      // Create the new invoice entry for the creditor's ledger
      const newInvoice = {
        invoice_no: formData.invoice_no,
        total_value: totalAmount,
        date_created: new Date(formData.date_received),
      };

      // Update the company's stock and entries
      await axios.post(
        "/api/auth/retail/update-stock-and-entries",
        { stock: receivedPartsData, entries: tableData },
        {
          params: { company_no },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update creditor's ledger
      await axios.put(
        `/api/auth/accounts/updatecreditorledger/${formData.supplier}`,
        { company_no, newInvoice },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("Stock, entries, and creditor's ledger updated successfully!");
      navigate("/retail/lpolist");
    } catch (error) {
      console.error(
        "Error submitting entries or updating stock and entries:",
        error
      );
    }
  };

  return (
    <>
      <div>
        <div className="view-receive_top">
          <div className="view-receive-lpodetails-form">
            <h2>Edit LPO Details({lpo_no})</h2>
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
                  readOnly
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
                      const TBAccount_name = response.data.account_name;
                      const TBAccount_no = response.data.account_number;
                      setTBAccountName(TBAccount_name);
                      setTBAccountNo(TBAccount_no);
                    } catch (error) {
                      console.error(
                        "Error fetching account information:",
                        error
                      );
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
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
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
                  {lpo[0].products.map((lpo, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(lpo._id)}
                          checked={ReceivedParts.includes(lpo._id)}
                        />
                      </td>
                      <td>{lpo.unique_id}</td>
                      <td>{lpo.company_no}</td>
                      <td>{lpo.description}</td>
                      <td>{lpo.quantity}</td>
                      <td>
                        <input
                          type="number"
                          value={quantities[lpo._id] || ""}
                          onChange={(e) =>
                            handleQuantityChange(lpo._id, e.target.value)
                          }
                          min="0"
                          max={lpo.quantity}
                        />
                      </td>
                      <td>{lpo.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data available</p>
            )}
            <div>
              <p>Net: {calculateNetAmount().toFixed(2)}</p>
              <p>Vat: {calculateVatAmount(calculateNetAmount()).toFixed(2)}</p>
              <p>
                Total:{" "}
                {calculateTotalAmount(
                  calculateNetAmount(),
                  calculateVatAmount(calculateNetAmount())
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="view-receive-lpo-entries">
        {showTable && (
          <div>
            <h2>LPO Entries</h2>
            <table>
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Type</th>
                  <th>USD Rate</th>
                  <th>Date</th>
                  <th>Narration</th>
                  <th>Doc Ref</th>
                  <th>Amount</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.account_name}</td>
                    <td>{row.account_number}</td>
                    <td>{row.type}</td>
                    <td>{row.usd_rate}</td>
                    <td>{row.date}</td>
                    <td>{row.narration}</td>
                    <td>{row.doc_ref}</td>
                    <td>{row.amount}</td>
                    <td>{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleFinalSubmit}>Final Submit</button>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewReceive;
