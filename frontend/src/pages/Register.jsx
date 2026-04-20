import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../lib/api.js";
import AuthCard from "../components/AuthCard";
import AnimatedInput from "../components/AnimatedInput";
import FallingPetals from "../components/FallingPetals";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.message || "No se pudo registrar");
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
            Crear cuenta
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Regístrate para acceder al panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

          <AnimatedInput
            label="Nombre"
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <AnimatedInput
            label="Apellidos"
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />

          <AnimatedInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="nombre@empresa.com"
            required
            autoComplete="email"
          />

          <AnimatedInput
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
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
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-3 rounded-lg
                       font-medium hover:bg-slate-900 transition disabled:opacity-60"
          >
            {loading ? "Creando..." : "Registrarme"}
          </motion.button>
        </form>

        <p className="text-sm text-center text-slate-500 pb-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-slate-800 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}