// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/AuthSlice";


const AdminLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      dispatch(login({
        user: JSON.parse(storedUser),
        token: storedToken,
      }));
    }
  }, [dispatch]);

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-grow bg-blue-50 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
