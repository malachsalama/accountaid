import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

export default function RetailHome() {
  const [retailNames, setRetailNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRetailNames = async () => {
      try {
        const response = await axios.get("/api/auth/retail/retailnames");
        setRetailNames(response.data);
      } catch (error) {
        console.error("An error occurred while fetching retail names:", error);
      }
    };

    fetchRetailNames();
  }, []);

  return (
    <div>
      {retailNames.map((retailname) => (
        <Link key={retailname._id} to={`/retail/${retailname.retailname}`}>
          {retailname.retailname}
        </Link>
      ))}
      <button onClick={() => navigate("lpolist")}>Lpo List</button>
      <button onClick={() => navigate("lpo")}>Lpo</button>
    </div>
  );
}
