import axios from "axios";
import { getAuthToken } from "@/utils/authToken";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  // baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Failed to parse auth token", e);
  }

  return config;
});

export default api;
