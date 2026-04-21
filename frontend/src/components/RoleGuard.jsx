import { Navigate } from "react-router-dom";
import { getUserRole } from "../lib/auth.js";

export default function RoleGuard({ allowedRoles, children }) {
  const role = getUserRole();
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
