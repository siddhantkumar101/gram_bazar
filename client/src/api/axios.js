import axios from "axios";

let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Auto-fix: Ensure URL ends with /api to prevent 404s
if (baseUrl && !baseUrl.endsWith("/api") && !baseUrl.endsWith("/api/")) {
  baseUrl = baseUrl.endsWith("/") ? `${baseUrl}api` : `${baseUrl}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
