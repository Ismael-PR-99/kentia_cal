const TOKEN_KEY = "auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const parseJwt = (token) => {
	if (!token) return null;
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	try {
		const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const decoded = atob(payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "="));
		return JSON.parse(decoded);
	} catch {
		return null;
	}
};

export const getUserRole = () => {
	const token = getToken();
	const payload = parseJwt(token);
	return payload?.role || null;
};
