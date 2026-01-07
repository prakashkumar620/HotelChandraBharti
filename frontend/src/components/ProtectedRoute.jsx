import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { adminToken, admin, token, user, isAdminLoggedIn, isLoggedIn } = useContext(AuthContext);

  // For admin routes, check adminToken and admin
  if (adminOnly) {
    const hasAdminAuth = adminToken && admin;
    if (!hasAdminAuth) {
      return <Navigate to="/admin/login" replace />;
    }
  } 
  // For user routes, check token and user
  else {
    const hasUserAuth = token && user;
    if (!hasUserAuth) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
