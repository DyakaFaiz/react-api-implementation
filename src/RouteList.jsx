import { createBrowserRouter } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Mahasiswa from "./Pages/admin/Mahasiswa";
import ProtectedRoute from "./ProtectedRoute";

const RouteList = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Halaman Login
  },
  {
    path: "/register",
    element: <Register />, // Halaman Register
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ), // Rute Admin dilindungi
    children: [
      {
        index: true,
        element: <Dashboard />, // Dashboard
      },
      {
        path: "mahasiswa",
        element: <Mahasiswa />, // Halaman Mahasiswa
      },
    ],
  },
]);

export default RouteList;