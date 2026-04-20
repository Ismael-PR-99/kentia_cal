import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { approveDataset } from "../lib/api.js";
import Navbar from "../components/Navbar.jsx";

export default function DatasetReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveDataset(id);
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-950 mb-8">Revisar Dataset #{id}</h1>

        <div className="card space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Estado:</span>
            <span className="badge-app">Under Approval</span>
          </div>

          {/* Review Content */}
          <div>
            <h3 className="text-lg font-semibold text-gray-950 mb-4">Cambios a revisar</h3>
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-950">Variable</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-950">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-950">Madurez</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-row">
                  <td colSpan="3" className="py-8 px-4 text-center text-gray-600">
                    Cargando cambios...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? "Aprobando..." : "✓ Aprobar Dataset"}
            </button>
            <button
              onClick={() => navigate(`/dashboard/datasets/${id}`)}
              className="flex-1 btn-secondary"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
