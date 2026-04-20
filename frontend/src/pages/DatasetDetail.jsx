import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function DatasetDetail() {
  const { id } = useParams();
  const [tab, setTab] = useState("labels");

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Dataset #{id}</h1>

        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {["labels", "artefacts", "changelog"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-medium transition ${
                tab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-slate-50 rounded-lg p-8">
          {tab === "labels" && <div>?? Labels tab content</div>}
          {tab === "artefacts" && <div>?? Artefacts tab content</div>}
          {tab === "changelog" && <div>?? Change Log tab content</div>}
        </div>
      </div>
    </>
  );
}
