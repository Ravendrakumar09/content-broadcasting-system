import axios from "axios";
import { getToken } from "../utils/storage";

const defaultApiOrigin =
  process.env.API_SERVER_URL || "http://127.0.0.1:5500";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiOrigin;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const method = (config.method || "get").toLowerCase();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (method === "get") {
    config.params = {
      ...(config.params || {}),
      _ts: Date.now(),
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timed out. Please retry."));
    }

    const status = error.response?.status;
    const requestPath = error.config?.url || "";
    const resolvedUrl = requestPath
      ? `${baseURL.replace(/\/$/, "")}/${requestPath.replace(/^\//, "")}`
      : baseURL;

    if (status >= 500) {
      return Promise.reject(
        new Error(
          `Server error (${status}) from ${resolvedUrl}. Ensure API is running with: npm run api`
        )
      );
    }

    if (!error.response) {
      return Promise.reject(
        new Error(
          `Network error. Unable to reach ${resolvedUrl}. Make sure the API server is running (npm run api).`
        )
      );
    }

    return Promise.reject(error);
  }
);

export default api;
