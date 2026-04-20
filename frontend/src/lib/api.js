import { getToken, clearToken } from "./auth.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
    headers: buildHeaders(),
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
};

export const register = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

// --- Calibration: Features ---
export const listFeatures = async () => {
  const res = await fetch(`${BASE_URL}/api/calibration/features/`, {
    headers: buildHeaders()
  });
  return handleResponse(res);
};

export const getFeature = async (id) => {
  const res = await fetch(`${BASE_URL}/api/calibration/features/${id}/`, {
    headers: buildHeaders()
  });
  return handleResponse(res);
};

// --- Calibration: Variables ---
export const listVariables = async () => {
  const res = await fetch(`${BASE_URL}/api/calibration/variables/`, {
    headers: buildHeaders()
  });
  return handleResponse(res);
};

// --- Calibration: Releases ---
export const listReleases = async () => {
  const res = await fetch(`${BASE_URL}/api/calibration/releases/`, {
    headers: buildHeaders()
  });
  return handleResponse(res);
};

export const createRelease = async (data) => {
  const res = await fetch(`${BASE_URL}/api/calibration/releases/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

// --- Calibration: Values ---
export const listCalibrationValues = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${BASE_URL}/api/calibration/calibration-values/?${params}`, {
    headers: buildHeaders()
  });
  return handleResponse(res);
};

export const createCalibrationValue = async (data) => {
  const res = await fetch(`${BASE_URL}/api/calibration/calibration-values/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const updateCalibrationValue = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/calibration/calibration-values/${id}/`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const approveCalibrationValue = async (id) => {
  return updateCalibrationValue(id, { maturity: "1.00", verified: true });
};

export const createPatient = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/patients/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const updatePatient = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/patients/${id}/`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
};

export const deletePatient = async (id) => {
  const res = await fetch(`${BASE_URL}/api/patients/${id}/`, {
    method: "DELETE",
    headers: buildHeaders()
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const detail = data?.detail || "Error de servidor";
    throw new Error(detail);
  }
  return true;
};
