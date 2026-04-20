import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Patients from "./pages/Patients.jsx";
import PatientPortal from "./pages/PatientPortal.jsx";
import Calculadoras from "./pages/Calculadoras.jsx";
import CalculadoraIMC from "./pages/CalculadoraIMC.jsx";
import CalculadoraCalorias from "./pages/CalculadoraCalorias.jsx";
import CalculadoraHidratacion from "./pages/CalculadoraHidratacion.jsx";
import Layout from "./components/Layout.jsx";
import { getToken, getUserRole } from "./lib/auth.js";

const RequireAuth = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleDashboard = () => {
  const role = getUserRole();
  if (role === "doctor") return <Patients />;
  return <PatientPortal />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<ArticleDetail />} />
      <Route path="/calculadoras" element={<Calculadoras />} />
      <Route path="/calculadoras/imc" element={<CalculadoraIMC />} />
      <Route path="/calculadoras/calorias" element={<CalculadoraCalorias />} />
      <Route path="/calculadoras/hidratacion" element={<CalculadoraHidratacion />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<RoleDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
