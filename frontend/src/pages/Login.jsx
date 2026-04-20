import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../lib/api.js";
import Navbar from "../components/Navbar.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-lg border border-gray-light p-8 w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="text-2xl font-bold text-green-dark mb-3">⚙ kentia_cal</div>
            <h1 className="text-xl font-bold text-gray-950">Iniciar sesión</h1>
            <p className="text-sm text-gray-600 mt-1">Sistema de calibración de ECUs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-950 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-dark/30 focus:border-transparent bg-white text-gray-950"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-950 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-dark/30 focus:border-transparent bg-white text-gray-950"
                required
              />
            </div>

            {error && (
              <div className="text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-dark text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Accediendo..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-green-dark font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
