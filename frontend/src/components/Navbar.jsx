import { Link, useNavigate } from "react-router-dom";
import { getToken, clearToken, getUserRole } from "../lib/auth.js";

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const role = getUserRole();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl">
            kentia_cal
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6">
            {token ? (
              <>
                <span className="text-xs text-slate-400">Rol: {role}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
          </div>
        </div>
      </div>
    </nav>
  );
}
