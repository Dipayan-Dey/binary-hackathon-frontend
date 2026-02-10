import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
// import { useAuth } from "../context/authContext";

// Redirect authenticated users away from login/signup pages
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If user is already logged in, redirect to dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Protect routes that require authentication
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If user is not logged in, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
