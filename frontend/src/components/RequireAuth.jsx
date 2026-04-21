import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../lib/auth.js";

export default function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}
