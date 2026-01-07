import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  // Check both sessionStorage and localStorage for tokens (prefer sessionStorage for current session)
  const token = sessionStorage.getItem("token") || sessionStorage.getItem("adminToken") || 
                localStorage.getItem("token") || localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("admin");
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
