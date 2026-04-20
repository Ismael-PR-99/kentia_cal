import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CalculadoraHidratacion() {
  const [peso, setPeso] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("temperate");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);
    setLoading(true);

    // Validaciones frontend
    const pesoNum = parseFloat(peso);

    if (pesoNum < 30 || pesoNum > 300) {
      setError("El peso debe estar entre 30 y 300 kg");
      setLoading(false);
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${BASE_URL}/api/calculators/water/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: pesoNum,
          activity: activity,
          climate: climate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al calcular hidratación");
      }

      setResultado(data);
    } catch (err) {
      setError(err.message || "Error al calcular. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/calculadoras" className="text-cyan-600 hover:text-cyan-700 font-medium mb-6 inline-block">
          ← Volver a calculadoras
        </Link>

        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white text-center">
            <div className="text-6xl mb-4">💧</div>
            <h1 className="text-3xl font-bold mb-2">Calculadora de Hidratación</h1>
            <p className="text-cyan-50">Ingesta Diaria de Agua Recomendada</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  required
                  placeholder="Ej: 70"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none text-lg"
                />
                <p className="text-sm text-slate-500 mt-1">Entre 30 y 300 kg</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nivel de Actividad Física *
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                >
                  <option value="low">Bajo (poco ejercicio)</option>
                  <option value="moderate">Moderado (ejercicio regular)</option>
                  <option value="high">Alto (ejercicio intenso diario)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Clima donde vives *
                </label>
                <select
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                >
                  <option value="cold">Frío</option>
                  <option value="temperate">Templado</option>
                  <option value="hot">Caluroso</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Calculando..." : "Calcular Hidratación"}
              </button>
            </form>

            {resultado && (
              <div className="mt-8 space-y-4">
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-slate-600 mb-2">Necesitas beber aproximadamente:</p>
                  <p className="text-5xl font-bold text-cyan-600 mb-2">{resultado.daily_water_liters}L</p>
                  <p className="text-lg text-slate-600">
                    ({resultado.daily_water_ml} ml al día)
                  </p>
                  <div className="mt-4 pt-4 border-t-2 border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Equivalente a:</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-4xl">🥤</div>
                      <p className="text-3xl font-bold text-slate-900">
                        {resultado.glasses_250ml} vasos
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">(250 ml cada uno)</p>
                  </div>
                </div>

                <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6">
                  <h3 className="font-semibold text-cyan-900 mb-3">Distribución recomendada:</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌅</span>
                        <p className="font-medium text-slate-900">Mañana</p>
                      </div>
                      <p className="text-xl font-bold text-cyan-600">
                        {resultado.recommendations.morning} vasos
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">☀️</span>
                        <p className="font-medium text-slate-900">Tarde</p>
                      </div>
                      <p className="text-xl font-bold text-cyan-600">
                        {resultado.recommendations.afternoon} vasos
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌙</span>
                        <p className="font-medium text-slate-900">Noche</p>
                      </div>
                      <p className="text-xl font-bold text-cyan-600">
                        {resultado.recommendations.evening} vasos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">💡 Consejos:</h3>
                  <ul className="space-y-2">
                    {resultado.tips.map((tip, index) => (
                      <li key={index} className="text-blue-900 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-sm">
                  <p className="text-amber-900">
                    ⚠️ <strong>Disclaimer:</strong> {resultado.disclaimer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
