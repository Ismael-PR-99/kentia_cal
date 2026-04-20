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

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Datasets de Calibración</h1>
          <Link
            to="/dashboard/datasets/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Nuevo Dataset
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-600">Cargando...</p>
        ) : releases.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600">No hay datasets. <Link to="/dashboard/datasets/new" className="text-blue-600 font-medium">Crear uno</Link></p>
          </div>
        ) : (
          <div className="grid gap-4">
            {releases.map((r) => (
              <Link
                key={r.id}
                to={`/dashboard/datasets/${r.id}`}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="font-bold text-slate-900">{r.number}</h3>
                <p className="text-sm text-slate-600">{r.date}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
