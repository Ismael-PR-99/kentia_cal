import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { approveCalibrationValue } from "../lib/api.js";
import Navbar from "../components/Navbar.jsx";

export default function DatasetReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveCalibrationValue(id);
      navigate(`/dashboard/datasets/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Revisión Dataset #{id}</h1>

        <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-4">
          <p className="text-slate-600">Contenido de revisión...</p>

          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Aprobando..." : "Aprobar"}
            </button>
            <button
              onClick={() => navigate(`/dashboard/datasets/${id}`)}
              className="flex-1 bg-slate-600 text-white py-2 rounded-lg font-medium hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
