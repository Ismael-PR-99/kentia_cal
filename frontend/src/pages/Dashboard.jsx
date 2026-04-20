import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listReleases } from "../lib/api.js";
import Navbar from "../components/Navbar.jsx";

export default function Dashboard() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReleases();
  }, []);

  const loadReleases = async () => {
    try {
      const data = await listReleases();
      setReleases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      "EDIT": "badge-edit",
      "APP": "badge-app",
      "RC": "badge-rc",
      "REL": "badge-rel",
      "DEP": "badge-dep",
    };
    return badges[status] || "badge-edit";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-950">Datasets de Calibración</h1>
          <Link
            to="/dashboard/datasets/new"
            className="btn-primary"
          >
            + Nuevo Dataset
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="card text-center">
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : releases.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-600 mb-4">No hay datasets disponibles</p>
            <Link to="/dashboard/datasets/new" className="btn-primary text-sm">
              Crear el primer dataset
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-950">Número</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-950">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-950">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-950">Acción</th>
                </tr>
              </thead>
              <tbody>
                {releases.map((r) => (
                  <tr key={r.id} className="table-row">
                    <td className="py-3 px-4 font-medium text-gray-950">{r.number}</td>
                    <td className="py-3 px-4 text-gray-600">{r.date}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(r.status || "EDIT")}>
                        {r.status || "EDIT"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/dashboard/datasets/${r.id}`}
                        className="text-green-dark hover:font-semibold transition font-medium text-sm"
                      >
                        Ver detalles →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
