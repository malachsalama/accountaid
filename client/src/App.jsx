/* eslint-disable react/prop-types */
import { Route, Routes, Outlet } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { Register, Login, ProtectedRoutes } from "./components/authentication";
import { Lpo, LpoList, RetailHome, ViewReceive } from "./pages/retail";
import { RegCompany, SuperAdminHome } from "./pages/accountaid";
import { EditVariables, ManagementHome, RegDepartment } from "./pages/admin";
import { AccountsHome, CreateCreditor, TbAccounts } from "./pages/accounts";
import HumanResourceHome from "./pages/human_resource/HumanResourceHome";
import "./App.css";
import Notifications from "./components/notifications/Notifications";

function App() {
  return (
    <div className="app">
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/accountaid"
            element={
              <ProtectedRoutes>
                <SuperAdminHome />
                <Outlet />
              </ProtectedRoutes>
            }
          >
            <Route path="reg-company" element={<RegCompany />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoutes>
                <ManagementHome />
                <Outlet />
              </ProtectedRoutes>
            }
          >
            <Route path="user-registration" element={<Register />} />
            <Route path="department-registration" element={<RegDepartment />} />
            <Route path="edit-variables" element={<EditVariables />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route
            path="/retail"
            element={
              <ProtectedRoutes>
                <RetailHome />
                <Outlet />
              </ProtectedRoutes>
            }
          >
            <Route path="lpo" element={<Lpo />} />
            <Route path="lpolist" element={<LpoList />} />
            <Route path="viewReceive" element={<ViewReceive />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route
            path="/accounts"
            element={
              <ProtectedRoutes>
                <AccountsHome />
                <Outlet />
              </ProtectedRoutes>
            }
          >
            <Route path="createcreditor" element={<CreateCreditor />} />
            <Route path="tbaccounts" element={<TbAccounts />} />
          </Route>
          <Route
            path="/humanresource"
            element={
              <ProtectedRoutes>
                <HumanResourceHome />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
