import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-4">Loading...</p>;
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
