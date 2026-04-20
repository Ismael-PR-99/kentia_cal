import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth.js";
import Navbar from "../components/Navbar.jsx";

export default function Home() {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  if (token) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Calibration Manager
            </h1>
            <p className="text-xl text-slate-600 mb-12">
              Sistema de gestión de calibración de ECUs para automoción
            </p>
            <a
              href="/login"
              className="px-8 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors inline-block"
            >
              Acceder al sistema
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Características principales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">??</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Gestión de Datasets
                </h3>
                <p className="text-slate-600">
                  Gestiona datasets completos de calibración con valores, unidades y trazabilidad total de cambios.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">??</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Ciclo de Vida Completo
                </h3>
                <p className="text-slate-600">
                  EDIT ? APPROVAL ? RC ? RELEASED. Control total del proceso desde creación hasta release.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">???</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Gestión por Labels
                </h3>
                <p className="text-slate-600">
                  Organiza y gestiona valores de calibración con etiquetas, unidades y descripciones detalladas.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">??</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Control de Roles
                </h3>
                <p className="text-slate-600">
                  Roles diferenciados: OEM (aprueba), Supplier (edita), Admin (total), Viewer (consulta).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-slate-600 mb-6">
              Inicia sesión en el sistema para acceder a tu workspace de calibración.
            </p>
            <a
              href="/login"
              className="px-8 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors inline-block"
            >
              Iniciar sesión
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-slate-100 text-center text-slate-600 text-sm">
          <p>© 2026 kentia_cal. Sistema de calibración para automoción.</p>
        </footer>
      </main>
    </>
  );
}
