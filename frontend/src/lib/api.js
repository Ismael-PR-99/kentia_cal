import { getToken, clearToken, setToken, setRole } from "./auth.js";

const BASE_URL = "http://localhost:8000";

const buildHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    clearToken();
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data?.detail || data?.error || "Error de servidor";
    throw new Error(detail);
  }
  return data;
};

// --- Auth ---
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  setToken(data.access);
  try {
    const b64 = data.access.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=")));
    setRole(payload.role || "viewer");
  } catch {}
  return data;
};

export const register = async (email, password, first_name, last_name, role) => {
  const res = await fetch(`${BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, first_name, last_name, role }),
  });
  return handleResponse(res);
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/me/`, { headers: buildHeaders() });
  return handleResponse(res);
};

// --- Datasets ---
export const listDatasets = async () => {
  const res = await fetch(`${BASE_URL}/api/calibration/datasets/`, { headers: buildHeaders() });
  return handleResponse(res);
};

export const createDataset = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/calibration/datasets/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const getDataset = async (id) => {
  const res = await fetch(`${BASE_URL}/api/calibration/datasets/${id}/`, { headers: buildHeaders() });
  return handleResponse(res);
};

export const submitDataset = async (id) => {
  const res = await fetch(`${BASE_URL}/api/calibration/datasets/${id}/submit/`, {
    method: "POST",
    headers: buildHeaders(),
  });
  return handleResponse(res);
};

export const approveDataset = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/calibration/datasets/${id}/approve/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

// --- Labels (CalibrationValues) ---
export const listLabels = async (datasetId) => {
  const res = await fetch(`${BASE_URL}/api/calibration/values/?release=${datasetId}`, {
    headers: buildHeaders(),
  });
  return handleResponse(res);
};

export const updateLabel = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/calibration/values/${id}/`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

// --- Features ---
export const listFeatures = async () => {
  const res = await fetch(`${BASE_URL}/api/calibration/features/`, { headers: buildHeaders() });
  return handleResponse(res);
};

// --- Releases ---
export const listReleases = async () => {
  const res = await fetch(`${BASE_URL}/api/calibration/releases/`, { headers: buildHeaders() });
  return handleResponse(res);
};
