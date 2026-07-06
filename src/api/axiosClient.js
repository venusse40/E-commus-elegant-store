import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the auth token to every request if it exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("Elegant-Store_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handling: if the token is invalid/expired, clear it
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("Elegant-Store_token");
      localStorage.removeItem("Elegant-Store_user");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;