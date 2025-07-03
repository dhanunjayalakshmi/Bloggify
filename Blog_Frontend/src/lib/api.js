import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storageData = localStorage?.getItem("auth-storage");
  if (storageData) {
    try {
      const parsed = JSON?.parse(storageData);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Failed to parse auth token", e);
    }
  }
  return config;
});

export default api;
