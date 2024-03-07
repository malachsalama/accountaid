/* eslint-disable react/prop-types */
import { Route, Routes, Outlet } from "react-router-dom";
import Login from "./components/authentication/Login";
import { CreateLpo, LpoDetails, LpoList, RetailHome } from "./pages/retail";
import { RegCompany, SuperAdminHome } from "./pages/accountaid";
import ManagementHome from "./pages/admin/ManagementHome";
import AccountsHome from "./pages/accounts/AccountsHome";
import HumanResourceHome from "./pages/human_resource/HumanResourceHome";
import Navbar from "./components/navbar/Navbar";
import CreateCreditor from "./pages/accounts/CreateCreditor";
import CreditorList from "./pages/accounts/CreditorList";
import ProtectedRoute from "./components/authentication/ProtectedRoutes";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute>
              <SuperAdminHome />
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="reg-company" element={<RegCompany />} />
        </Route>
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
    </div>
  );
}

export default App;
