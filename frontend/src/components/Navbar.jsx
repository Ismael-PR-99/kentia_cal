import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken, getUserRole, getUser } from "../lib/auth.js";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const role = getUserRole();
  const user = getUser();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);
  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-green-dark border-b-2 border-green-dark"
        : "text-slate-600 hover:text-slate-900"
    }`;

  const getInitials = () => {
    if (!user?.first_name && !user?.last_name) return user?.email?.[0]?.toUpperCase() || "U";
    const first = user?.first_name?.[0] || "";
    const last = user?.last_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">⚙</span>
            <span className="text-slate-900">kentia_cal</span>
          </Link>

          {/* Navigation Links */}
          {token && (
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/features" className={navLinkClass("/features")}>
                Features
              </Link>
              <Link to="/releases" className={navLinkClass("/releases")}>
                Releases
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-slate-900">
                      {user?.first_name || user?.email}
                    </span>
                    <span className="text-xs text-slate-500">{role}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-dark text-white flex items-center justify-center text-xs font-semibold">
                    {getInitials()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border border-green-dark text-green-dark rounded-lg hover:bg-green-light hover:bg-opacity-10 transition-colors font-medium text-sm"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

