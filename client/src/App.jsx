/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Login from "./components/authentication/Login";
import ManagementHome from "./pages/admin/ManagementHome";
import RetailHome from "./pages/retail/RetailHome";
import AccountsHome from "./pages/accounts/AccountsHome";
import HumanResourceHome from "./pages/human_resource/HumanResourceHome";
import Navbar from "./components/navbar/Navbar";
import CreateLpo from "./pages/retail/CreateLpo";
import LpoDetails from "./pages/retail/LpoDetails";
import CreateCreditor from "./pages/accounts/CreateCreditor";
import CreditorList from "./pages/accounts/CreditorList";
import ProtectedRoute from "./components/authentication/ProtectedRoutes";
import "./App.css";
import LpoList from "./pages/retail/LpoList";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <ManagementHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retail"
            element={
              <ProtectedRoute>
                <RetailHome />
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="createlpo" element={<CreateLpo />} />
            <Route path="LpoDetails" element={<LpoDetails />} />
            <Route path="lpolist" element={<LpoList />} />
          </Route>
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <AccountsHome />
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="createcreditor" element={<CreateCreditor />} />
            <Route path="creditorlist" element={<CreditorList />} />
          </Route>
          <Route
            path="/humanresource"
            element={
              <ProtectedRoute>
                <HumanResourceHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
