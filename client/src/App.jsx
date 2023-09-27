import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./components/Form";
import Home from "./pages/home/Home";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/home", element: <Home /> },
  // Add more routes as needed
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
