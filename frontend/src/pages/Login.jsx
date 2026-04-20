import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../lib/api.js";
import { setToken } from "../lib/auth.js";
import AuthCard from "../components/AuthCard";
import AnimatedInput from "../components/AnimatedInput";
import FallingPetals from "../components/FallingPetals";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      setToken(data.access);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 relative">
      <FallingPetals />

      <AuthCard>
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <h1 className="text-2xl font-semibold text-slate-800">
            Acceso profesional
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Plataforma de gestión clínica
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

          <AnimatedInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@clinica.com"
            required
          />

          <AnimatedInput
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-700 bg-red-50
                         border border-red-200 rounded-lg px-4 py-2"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-slate-800 text-white py-3 rounded-lg
                       font-medium hover:bg-slate-900 transition"
          >
            {loading ? "Verificando..." : "Acceder"}
          </motion.button>
        </form>

        <p className="text-sm text-center text-slate-500 pb-6">
          ¿No tienes acceso?{" "}
          <Link to="/register" className="text-slate-800 font-medium hover:underline">
            Solicitar cuenta
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
