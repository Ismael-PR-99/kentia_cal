import { Navigate } from "react-router-dom";
import { isAdmin } from "../lib/auth.js";

export default function AdminGuard({ children }) {
  if (isAdmin()) return children;
  return <Navigate to="/" replace />;
}
