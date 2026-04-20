import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Calculadoras() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Calculadoras de Salud
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Herramientas gratuitas para calcular métricas básicas de salud.
            Todas las calculadoras son orientativas y no sustituyen el consejo médico profesional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Link
            to="/calculadoras/imc"
            className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl transition group"
          >
            <div className="text-6xl mb-6 text-center">⚖️</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition">
              Calculadora IMC
            </h2>
            <p className="text-slate-600 mb-4">
              Calcula tu Índice de Masa Corporal (IMC) ingresando tu peso y altura.
              Obtén tu categoría según los estándares de la OMS.
            </p>
            <div className="text-emerald-600 font-medium">
              Calcular IMC →
            </div>
          </Link>

          <Link
            to="/calculadoras/calorias"
            className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition group"
          >
            <div className="text-6xl mb-6 text-center">🔥</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
              Calorías Diarias
            </h2>
            <p className="text-slate-600 mb-4">
              Descubre cuántas calorías necesitas al día según tu edad, sexo, peso, altura y nivel de actividad.
            </p>
            <div className="text-blue-600 font-medium">
              Calcular Calorías →
            </div>
          </Link>

          <Link
            to="/calculadoras/hidratacion"
            className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 hover:shadow-xl transition group"
          >
            <div className="text-6xl mb-6 text-center">💧</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition">
              Hidratación Diaria
            </h2>
            <p className="text-slate-600 mb-4">
              Calcula cuánta agua debes beber al día según tu peso y nivel de actividad física.
            </p>
            <div className="text-cyan-600 font-medium">
              Calcular Hidratación →
            </div>
          </Link>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
          <p className="text-amber-900 font-medium">
            ⚠️ <strong>Importante:</strong> Estas calculadoras proporcionan resultados orientativos con fines educativos.
            No constituyen diagnóstico ni recomendación médica. Consulta siempre con un profesional de la salud.
          </p>
        </div>
      </div>
    </div>
  );
}
