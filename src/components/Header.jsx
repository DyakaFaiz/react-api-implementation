// Header.jsx
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
};

export default Header;