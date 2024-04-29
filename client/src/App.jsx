/* eslint-disable react/prop-types */
import { Route, Routes, Outlet } from "react-router-dom";
import Login from "./components/authentication/Login";
import {
  CreateLpo,
  LpoDetails,
  LpoList,
  RetailHome,
  ViewReceive,
} from "./pages/retail";
import { RegCompany, SuperAdminHome } from "./pages/accountaid";
import { EditVariables, ManagementHome, RegDepartment } from "./pages/admin";
import AccountsHome from "./pages/accounts/AccountsHome";
import HumanResourceHome from "./pages/human_resource/HumanResourceHome";
import Navbar from "./components/navbar/Navbar";
import CreateCreditor from "./pages/accounts/CreateCreditor";
import CreditorList from "./pages/accounts/CreditorList";
import ProtectedRoute from "./components/authentication/ProtectedRoutes";
import "./App.css";
import Registration from "./components/authentication/Register";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/accountaid"
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
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="user-registration" element={<Registration />} />
          <Route path="department-registration" element={<RegDepartment />} />
          <Route path="edit-variables" element={<EditVariables />} />
        </Route>

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
          <Route path="viewReceive" element={<ViewReceive />} />
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
