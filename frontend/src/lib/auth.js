const TOKEN_KEY = "herko_token";
const ROLE_KEY = "herko_role";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const setRole = (role) => localStorage.setItem(ROLE_KEY, role);
export const getUserRole = () => localStorage.getItem(ROLE_KEY);
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
export const isAuthenticated = () => !!getToken();

const parseJwt = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const getCurrentUser = () => {
  const payload = parseJwt(getToken());
  if (!payload) return null;
  return {
    id: payload.user_id,
    nombre: [payload.first_name, payload.last_name].filter(Boolean).join(" ") || payload.email,
    email: payload.email,
    first_name: payload.first_name,
    last_name: payload.last_name,
    role: payload.role,
    rol: payload.role,
  };
};

export const getUser = getCurrentUser;

export const isAdmin = () => getCurrentUser()?.role === "admin";

export const isLoggedIn = () => !!getToken() && !!getCurrentUser();
