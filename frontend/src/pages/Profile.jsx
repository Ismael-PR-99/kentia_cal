import Navbar from "../components/Navbar.jsx";
import { getCurrentUser } from "../lib/auth.js";

export default function Profile() {
  const user = getCurrentUser();

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-950 mb-6">Mi Perfil</h1>
        <div className="card space-y-3">
          <p className="text-gray-700"><strong>Nombre:</strong> {user?.nombre || "-"}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user?.email || "-"}</p>
          <p className="text-gray-700"><strong>Rol:</strong> {user?.rol || "-"}</p>
        </div>
      </div>
    </>
  );
}
