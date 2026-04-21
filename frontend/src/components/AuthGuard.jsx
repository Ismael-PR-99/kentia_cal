import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../lib/auth.js";

export default function AuthGuard({ children }) {
  if (isLoggedIn()) return children;
  return <Navigate to="/auth/login" replace />;
}
