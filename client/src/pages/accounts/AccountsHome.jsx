import { Button } from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export default function AccountsHome() {
  const navigate = useNavigate();
  return (
  <div>
    <h2>Accounts Home Page</h2>

    <Button variant="outline-dark" onClick={()=> navigate("/createsupplier")}>Create Supplier</Button>
  </div>
  )
}
