import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
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
    const alturaNum = parseFloat(altura);

    if (pesoNum < 30 || pesoNum > 300) {
      setError("El peso debe estar entre 30 y 300 kg");
      setLoading(false);
      return;
    }

    if (alturaNum < 1.2 || alturaNum > 2.5) {
      setError("La altura debe estar entre 1.20 y 2.50 metros");
      setLoading(false);
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${BASE_URL}/api/calculators/bmi/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: pesoNum,
          height: alturaNum,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al calcular IMC");
      }

      setResultado(data);
    } catch (err) {
      setError(err.message || "Error al calcular. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    if (category.includes("Bajo peso")) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (category.includes("normal")) return "text-green-700 bg-green-50 border-green-200";
    if (category.includes("Sobrepeso")) return "text-orange-700 bg-orange-50 border-orange-200";
    if (category.includes("Obesidad")) return "text-red-700 bg-red-50 border-red-200";
    return "text-slate-700 bg-slate-50 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/calculadoras" className="text-emerald-600 hover:text-emerald-700 font-medium mb-6 inline-block">
          ← Volver a calculadoras
        </Link>

        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center">
            <div className="text-6xl mb-4">⚖️</div>
            <h1 className="text-3xl font-bold mb-2">Calculadora de IMC</h1>
            <p className="text-emerald-50">Índice de Masa Corporal</p>
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
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none text-lg"
                />
                <p className="text-sm text-slate-500 mt-1">Entre 30 y 300 kg</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Altura (metros) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.20"
                  max="2.50"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  required
                  placeholder="Ej: 1.75"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none text-lg"
                />
                <p className="text-sm text-slate-500 mt-1">Entre 1.20 y 2.50 metros</p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Calculando..." : "Calcular IMC"}
              </button>
            </form>

            {resultado && (
              <div className="mt-8 space-y-4">
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-slate-600 mb-2">Tu IMC es:</p>
                  <p className="text-5xl font-bold text-slate-900 mb-4">{resultado.bmi}</p>
                  <div className={`inline-block px-6 py-2 rounded-full border-2 font-semibold ${getCategoryColor(resultado.category)}`}>
                    {resultado.category}
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <p className="text-blue-900">
                    <strong>Recomendación:</strong> {resultado.recommendation}
                  </p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-sm">
                  <p className="text-amber-900">
                    ⚠️ <strong>Disclaimer:</strong> {resultado.disclaimer}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Clasificación OMS (Orientativa)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bajo peso:</span>
                      <span className="font-medium">{"< 18.5"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Normal:</span>
                      <span className="font-medium">18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sobrepeso:</span>
                      <span className="font-medium">25 - 29.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Obesidad:</span>
                      <span className="font-medium">{"≥ 30"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
