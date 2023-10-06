/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { decodeJWT } from "../utils/jwtUtils";
import Login from "./components/authentication/Login";
import Home from "./pages/admin/Home";

function App({ token }) {
  // const decodedUser = decodeJWT(token);
  // const isSuperAdmin = decodedUser && decodedUser.role === "superadmin";

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={isSuperAdmin ? <Home /> : <Login />} /> */}
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
