import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createRelease } from "../lib/api.js";
import Navbar from "../components/Navbar.jsx";

export default function DatasetNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ number: "", date: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await createRelease(formData);
      navigate(`/dashboard/datasets/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-950 mb-8">Nuevo Dataset</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-950 mb-2">Número de Release</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="ej: v1.0.0"
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-dark/30 focus:border-transparent bg-white text-gray-950"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-950 mb-2">Fecha</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-dark/30 focus:border-transparent bg-white text-gray-950"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-950 mb-2">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-dark/30 focus:border-transparent bg-white text-gray-950"
              rows="4"
              placeholder="Notas adicionales del dataset..."
            />
          </div>

          {error && (
            <div className="text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? "Creando..." : "Crear Dataset"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
