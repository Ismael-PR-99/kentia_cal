import Navbar from "../components/Navbar.jsx";

export default function AdminPanel() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-950">Panel Admin</h1>
        <div className="card">
          <p className="text-gray-700">
            Esta area esta restringida a administradores. Desde aqui se centralizan
            operaciones y metricas de administracion.
          </p>
        </div>
      </div>
    </>
  );
}
