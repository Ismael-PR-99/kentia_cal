import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-semibold text-xl text-slate-900">FisioApp</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/blog" className="text-slate-600 hover:text-slate-900 transition">
              Blog
            </Link>
            <Link to="/calculadoras" className="text-slate-600 hover:text-slate-900 transition">
              Calculadoras
            </Link>
            <Link to="/recursos" className="text-slate-600 hover:text-slate-900 transition">
              Recursos
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-slate-600 hover:text-slate-900 transition font-medium"
            >
              Acceder
            </Link>
            <Link
              to="/register"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition font-medium"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
