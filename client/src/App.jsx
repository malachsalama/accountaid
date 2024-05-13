/* eslint-disable react/prop-types */
import { Route, Routes, Outlet } from "react-router-dom";
import Login from "./components/authentication/Login";
import { Lpo, LpoList, RetailHome, ViewReceive } from "./pages/retail";
import { RegCompany, SuperAdminHome } from "./pages/accountaid";
import { EditVariables, ManagementHome, RegDepartment } from "./pages/admin";
import { AccountsHome, CreateCreditor, TbAccounts } from "./pages/accounts";
import HumanResourceHome from "./pages/human_resource/HumanResourceHome";
import Navbar from "./components/navbar/Navbar";
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
          <Route path="lpo" element={<Lpo />} />
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
          <Route path="tbaccounts" element={<TbAccounts />} />
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
