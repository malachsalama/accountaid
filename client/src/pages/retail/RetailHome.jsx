import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

export default function RetailHome() {
  const [retailNames, setRetailNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRetailNames = async () => {
      try {
        const response = await axios.get("/api/auth/retailnames");
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
      <Button variant="outline-dark" onClick={()=> navigate("createlpo")}>LPO</Button>
    </div>
  );
}
