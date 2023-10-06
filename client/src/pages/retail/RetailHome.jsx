import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

export default function RetailHome() {
  const [retailNames, setRetailNames] = useState([]);

  useEffect(() => {
    const fetchRetailNames = async () => {
      try {
        const response = await axios.get("/api/auth/retailnames");
        console.log(response.data);
        setRetailNames(response.data);
      } catch (error) {
        console.error("An error occurred while fetching retailnames:", error);
      }
    };

    fetchRetailNames();
  }, []);
  return (
    <div>
      {retailNames.map((retailname) => (
        <button key={retailname._id}>{retailname.retailname}</button>
      ))}
    </div>
  );
}
