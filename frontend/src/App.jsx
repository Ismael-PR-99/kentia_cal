import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import RoleGuard from "./components/RoleGuard.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DatasetDetail from "./pages/DatasetDetail.jsx";
import DatasetNew from "./pages/DatasetNew.jsx";
import DatasetReview from "./pages/DatasetReview.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/datasets/new"
        element={
          <RequireAuth>
            <RoleGuard allowedRoles={["admin", "supplier"]}>
              <DatasetNew />
            </RoleGuard>
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/datasets/:id"
        element={
          <RequireAuth>
            <DatasetDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/datasets/:id/review"
        element={
          <RequireAuth>
            <RoleGuard allowedRoles={["admin", "oem"]}>
              <DatasetReview />
            </RoleGuard>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
