import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function ViewReceive() {
  const location = useLocation();
  const lpo = location.state && location.state.lpo;
  const [selectedLpos, setSelectedLpos] = useState([]);
  const [quantities, setQuantities] = useState({});
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
    kra_pin: "",
    usd_rate: "",
    supplier: "",
    supplierName: "",
    vat: "",
  });

  useEffect(() => {
    if (lpo && lpo.length > 0) {
      const initialQuantities = {};
      lpo[0].products.forEach((product) => {
        initialQuantities[product._id] = product.quantity;
      });
      setQuantities(initialQuantities);

      // Set form data initially
      setFormData({
        kra_pin,
        usd_rate,
        supplier,
        supplierName,
        vat,
      });
    }
  }, [lpo, kra_pin, usd_rate, supplier, supplierName, vat]);

  const handleCheckboxChange = (lpo_id) => {
    setSelectedLpos((prevSelected) => {
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
      setSelectedLpos((prevSelected) =>
        prevSelected.filter((id) => id !== lpo_id)
      );
    } else {
      const newQuantityInt = parseInt(newQuantity);
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [lpo_id]: newQuantityInt,
      }));
      setSelectedLpos((prevSelected) => {
        if (!prevSelected.includes(lpo_id)) {
          return [...prevSelected, lpo_id];
        } else {
          return prevSelected;
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const calculateTotalPrice = () => {
    return selectedLpos.reduce((acc, id) => {
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

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1" }}>
        <h3>Edit LPO Details({lpo_no})</h3>
        <form>
          <label>
            KRA PIN:
            <input
              type="text"
              name="kra_pin"
              value={formData.kra_pin}
              onChange={handleInputChange}
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
            />
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
                      checked={selectedLpos.includes(item._id)}
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
