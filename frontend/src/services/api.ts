import axios from "axios";

import { getStoredToken } from "../lib/auth-storage";

const baseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "/api" : "http://localhost:4000/api");

export const api = axios.create({
  baseURL,
  timeout: 30000 // 30s – Vercel cold starts can be slow on free tier
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("[api] Request timed out:", error.config?.url);
    } else if (!error.response) {
      console.error("[api] Network error (no response):", error.config?.url, error.message);
    } else {
      console.error(`[api] ${error.response.status}:`, error.config?.url, error.response.data);
    }
    return Promise.reject(error);
  }
);
