import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CalculadoraCalorias() {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    activity: "sedentary",
  });
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);
    setLoading(true);

    // Validaciones frontend
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    if (weight < 30 || weight > 300) {
      setError("El peso debe estar entre 30 y 300 kg");
      setLoading(false);
      return;
    }

    if (height < 120 || height > 250) {
      setError("La altura debe estar entre 120 y 250 cm");
      setLoading(false);
      return;
    }

    if (age < 16 || age > 100) {
      setError("La edad debe estar entre 16 y 100 años");
      setLoading(false);
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${BASE_URL}/api/calculators/calories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: weight,
          height: height,
          age: age,
          gender: formData.gender,
          activity: formData.activity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al calcular calorías");
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
        <Link to="/calculadoras" className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-block">
          ← Volver a calculadoras
        </Link>

        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h1 className="text-3xl font-bold mb-2">Calculadora de Calorías</h1>
            <p className="text-blue-50">Necesidades Diarias de Energía</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sexo *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Edad *
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="16"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 30"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-sm text-slate-500 mt-1">Entre 16 y 100 años</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    min="30"
                    max="300"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 70"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-sm text-slate-500 mt-1">Entre 30 y 300 kg</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Altura (cm) *
                  </label>
                  <input
                    type="number"
                    name="height"
                    min="120"
                    max="250"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 175"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-sm text-slate-500 mt-1">Entre 120 y 250 cm</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nivel de Actividad *
                </label>
                <select
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="sedentary">Sedentario (poco o ningún ejercicio)</option>
                  <option value="light">Ligero (ejercicio 1-3 días/semana)</option>
                  <option value="moderate">Moderado (ejercicio 3-5 días/semana)</option>
                  <option value="active">Activo (ejercicio 6-7 días/semana)</option>
                  <option value="very_active">Muy activo (ejercicio intenso diario)</option>
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
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Calculando..." : "Calcular Calorías"}
              </button>
            </form>

            {resultado && (
              <div className="mt-8 space-y-4">
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-slate-600 mb-2">Metabolismo Basal (BMR)</p>
                  <p className="text-3xl font-bold text-slate-900 mb-4">{resultado.bmr} kcal/día</p>
                  
                  <div className="border-t-2 border-slate-200 my-4"></div>
                  
                  <p className="text-sm text-slate-600 mb-2">Necesidad Calórica Diaria</p>
                  <p className="text-5xl font-bold text-blue-600 mb-2">{resultado.daily_calories}</p>
                  <p className="text-sm text-slate-600">kcal/día</p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Recomendaciones según objetivo:</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">Perder peso</p>
                        <p className="text-sm text-slate-600">Déficit calórico</p>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">{resultado.recommendations.weight_loss}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">Mantener peso</p>
                        <p className="text-sm text-slate-600">Equilibrio</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{resultado.recommendations.maintenance}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">Ganar peso</p>
                        <p className="text-sm text-slate-600">Superávit calórico</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{resultado.recommendations.weight_gain}</p>
                    </div>
                  </div>
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
