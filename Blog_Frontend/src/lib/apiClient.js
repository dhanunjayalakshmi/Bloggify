import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current token to every request
api.interceptors.request.use((config) => {
  try {
    const token = useAuthStore.getState()?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Failed to read auth token", e);
  }
  return config;
});

// Flag prevents firing multiple sign-out toasts when several requests 401 at once
let isHandling401 = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Server is down, no internet, or backend not running
      toast.error("Unable to reach the server. Please check your connection.", {
        id: "network-error",
      });
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401) {
      const { user, clearAuth } = useAuthStore.getState();
      // Only act if the user was actually logged in (avoids noise on public routes)
      if (user && !isHandling401) {
        isHandling401 = true;
        clearAuth(); // PrivateRoute will redirect to "/" automatically
        toast.error("Your session has expired. Please log in again.", {
          id: "session-expired",
        });
        setTimeout(() => {
          isHandling401 = false;
        }, 3000);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
