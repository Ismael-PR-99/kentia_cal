import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function DatasetDetail() {
  const { id } = useParams();
  const [tab, setTab] = useState("labels");

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-950 mb-8">Dataset #{id}</h1>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-gray-light">
          {["labels", "artefacts", "changelog"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                tab === t
                  ? "text-green-dark border-green-dark"
                  : "text-gray-600 border-transparent hover:text-gray-950"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {tab === "labels" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-950 mb-4">Labels</h3>
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Variable</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Unidad</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-950">Madurez</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td colSpan="4" className="py-8 px-4 text-center text-gray-600">
                      No hay labels disponibles
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {tab === "artefacts" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-950 mb-4">Artefacts</h3>
              <p className="text-gray-600">No hay artefacts disponibles</p>
            </div>
          )}
          {tab === "changelog" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-950 mb-4">Cambios</h3>
              <p className="text-gray-600">No hay cambios registrados</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
