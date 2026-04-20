import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DatasetDetail from "./pages/DatasetDetail.jsx";
import DatasetNew from "./pages/DatasetNew.jsx";
import DatasetReview from "./pages/DatasetReview.jsx";

const Home = () => (
  <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">kentia_cal</h1>
        <p className="text-xl text-slate-400 mb-8">Sistema de gestión de calibración para automoción</p>
        <a
          href="/dashboard"
          className="px-8 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Ir al dashboard
        </a>
      </div>
    </div>
  </>
);

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
