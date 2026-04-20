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

  const getInitials = () => {
    if (!user?.first_name && !user?.last_name) return user?.email?.[0]?.toUpperCase() || "U";
    const first = user?.first_name?.[0] || "";
    const last = user?.last_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/" || path === "/login") return null;
    if (path === "/dashboard") return [{ label: "Dashboard", path: "/dashboard" }];
    if (path.includes("/dashboard/datasets")) return [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Datasets", path: "/dashboard" },
    ];
    return null;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <nav className="bg-white border-b border-gray-light sticky top-0 z-40">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">⚙</span>
          <span className="text-green-dark">kentia_cal</span>
        </Link>

        {/* Breadcrumb - Center */}
        {breadcrumb && token && (
          <div className="hidden md:flex items-center gap-1 text-sm">
            {breadcrumb.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                {idx > 0 && <span className="text-gray-400">/</span>}
                <Link to={item.path} className="text-gray-600 hover:text-gray-950 transition">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              {/* Help & Notifications Icons */}
              <button className="text-gray-600 hover:text-gray-950 text-lg transition" title="Ayuda">
                ?
              </button>
              <button className="text-gray-600 hover:text-gray-950 text-lg transition relative" title="Notificaciones">
                🔔
              </button>

              {/* User Info & Avatar */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-light">
                <div className="flex flex-col items-end text-xs">
                  <span className="font-medium text-gray-950">
                    {user?.first_name || user?.email?.split("@")[0]}
                  </span>
                  <span className="text-gray-500 capitalize">{role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-dark text-white flex items-center justify-center text-xs font-bold">
                  {getInitials()}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-950 text-lg transition"
                title="Salir"
              >
                ↗
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 border border-green-dark text-green-dark rounded-lg font-medium hover:bg-green-dark hover:text-white transition-colors text-sm"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

