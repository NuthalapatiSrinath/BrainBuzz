// src/api/apiClient.js
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

// create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_token"); // stored on login
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // language header preference stored by UI (topbar)
  const lang = localStorage.getItem("bb_lang_code") || "en";
  config.headers["x-bb-lang"] = lang;

  return config;
});

// response interceptor for global error handling (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // example: token expired -> remove token and redirect to login
    if (err?.response?.status === 401) {
      // you can customize: window.location = "/login";
      // or emit event for app-level handling
      console.warn("Unauthorized - clearing token");
      // optionally clear token
      // localStorage.removeItem("bb_token");
    }
    return Promise.reject(err);
  }
);

export default api;
