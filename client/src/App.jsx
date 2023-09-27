import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/authentication/Login";
import Home from "./pages/admin/Home";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Home /> },
  // Add more routes as needed
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
