import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken, getUserRole, getUser, isAdmin, isLoggedIn } from "../lib/auth.js";

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
    const breadcrumbs = [{ label: "Herko", path: "/" }];

    if (path === "/" || path === "/login") return breadcrumbs;

    if (path === "/dashboard") {
      breadcrumbs.push({ label: "Calibration Datasets", path: "/dashboard" });
    } else if (path.includes("/dashboard/datasets/new")) {
      breadcrumbs.push({ label: "Calibration Datasets", path: "/dashboard" });
      breadcrumbs.push({ label: "New Dataset", path: "/dashboard/datasets/new" });
    } else if (path.includes("/dashboard/datasets/")) {
      breadcrumbs.push({ label: "Calibration Datasets", path: "/dashboard" });
      const datasetId = path.split("/").pop();
      breadcrumbs.push({ label: `Dataset #${datasetId}`, path: path });
    } else if (path === "/features") {
      breadcrumbs.push({ label: "Features", path: "/features" });
    } else if (path === "/releases") {
      breadcrumbs.push({ label: "Releases", path: "/releases" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <nav className="bg-white border-b border-gray-light sticky top-0 z-40">
      <div className="h-14 px-6 flex items-center justify-between">
        {/* Left: Logo + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-1.5 font-semibold text-sm flex-shrink-0">
            <span className="text-xl">⚙</span>
            <span className="text-green-dark">Herko</span>
          </Link>

          {/* Breadcrumb */}
          {token && breadcrumbs.length > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 text-sm ml-2 pl-2 border-l border-gray-light">
              {breadcrumbs.slice(1).map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <span className="text-gray-400 text-xs">{">"}  </span>}
                  <Link
                    to={crumb.path}
                    className={`transition ${
                      location.pathname === crumb.path
                        ? "text-gray-950 font-medium"
                        : "text-gray-600 hover:text-gray-950"
                    }`}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Icons & User */}
        <div className="flex items-center gap-3 ml-auto">
          {isAdmin() && (
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-700 hover:text-gray-950 transition"
            >
              Panel Admin
            </Link>
          )}
          {isLoggedIn() && (
            <Link
              to="/perfil"
              className="text-sm font-medium text-gray-700 hover:text-gray-950 transition"
            >
              Mi Perfil
            </Link>
          )}
          {!isLoggedIn() && (
            <Link
              to="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-950 transition"
            >
              Entrar
            </Link>
          )}

          {token ? (
            <>
              {/* Help Icon */}
              <button
                className="text-gray-600 hover:text-gray-950 transition p-1 rounded hover:bg-gray-50"
                title="Ayuda"
              >
                <span className="text-lg">?</span>
              </button>

              {/* Notifications Icon */}
              <button
                className="text-gray-600 hover:text-gray-950 transition p-1 rounded hover:bg-gray-50 relative"
                title="Notificaciones"
              >
                <span className="text-lg">🔔</span>
              </button>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-light" />

              {/* Avatar & User info */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-950 leading-tight">
                    {user?.first_name || user?.email?.split("@")[0]}
                  </span>
                  <span className="text-xs text-gray-500 capitalize leading-tight">{role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {getInitials()}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-950 transition p-1 rounded hover:bg-gray-50"
                title="Salir"
              >
                <span className="text-lg">↗</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 border border-green-dark text-green-dark rounded font-medium hover:bg-green-dark hover:text-white transition-colors text-sm whitespace-nowrap"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

