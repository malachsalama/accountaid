/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { decodeJWT } from "../utils/jwtUtils";
import Login from "./components/authentication/Login";
import ManagementHome from "./pages/admin/ManagementHome";
import RetailHome from "./pages/retail/RetailHome";
import AccountsHome from "./pages/accounts/AccountsHome";
import HumanResourceHome from "./pages/human_resource/HumanResourceHome";
import Navbar from "./components/navbar/Navbar";
import CreateLpo from "./pages/retail/CreateLpo"
import LpoDetails from "./pages/retail/LpoDetails"

function App() {
  // const decodedUser = decodeJWT(token);
  // const isSuperAdmin = decodedUser && decodedUser.role === "superadmin";

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={isSuperAdmin ? <Home /> : <Login />} /> */}
        <Route path="/" element={<Login />}></Route>
        <Route path="/admin" element={<ManagementHome />}></Route>
        <Route path="/retail" element={<RetailHome />}></Route>
        <Route path="/accounts" element={<AccountsHome />}></Route>
        <Route path="/humanresource" element={<HumanResourceHome />}></Route>
        <Route path="/retail/CreateLpo" element={<CreateLpo />}></Route>
        <Route path="/lpodetails" element={<LpoDetails />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
