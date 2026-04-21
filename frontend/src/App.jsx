import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
import AdminGuard from "./components/AdminGuard.jsx";
import AuthGuard from "./components/AuthGuard.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Datasets from "./pages/Datasets.jsx";
import DatasetDetail from "./pages/DatasetDetail.jsx";
import DatasetNew from "./pages/DatasetNew.jsx";
import DatasetReview from "./pages/DatasetReview.jsx";
import Profile from "./pages/Profile.jsx";
import Checkout from "./pages/Checkout.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminPanel />
          </AdminGuard>
        }
      />
      <Route
        path="/perfil"
        element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        }
      />
      <Route
        path="/checkout"
        element={
          <AuthGuard>
            <Checkout />
          </AuthGuard>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Datasets />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/datasets/new"
        element={
          <RequireAuth>
            <RoleGuard allowedRoles={["admin"]}>
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
            <RoleGuard allowedRoles={["admin"]}>
              <DatasetReview />
            </RoleGuard>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
