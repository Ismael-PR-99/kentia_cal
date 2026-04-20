import { Outlet, useNavigate } from "react-router-dom";
import { clearToken, getUserRole } from "../lib/auth.js";

export default function Layout() {
  const navigate = useNavigate();
  const role = getUserRole();
  const isDoctor = role === "doctor";

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isDoctor ? "Gestión de Pacientes" : "Portal del Paciente"}
            </h1>
            <p className="text-sm text-slate-500">
              {isDoctor ? "Panel del fisioterapeuta" : "Solicita y gestiona tus citas"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white shadow hover:bg-slate-800 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
