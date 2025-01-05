import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, redirectTo = "/" }) => {
  const token = useSelector((state) => state.auth?.token);
  const lclStorage = localStorage.getItem("token");
  if (!token || !lclStorage) {
    
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;  
