import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || "Request failed";

    const isSessionProbe = error.config?.url === "/auth/me";
    if (status === 401 && !isSessionProbe && !window.location.pathname.includes("/login")) {
      window.dispatchEvent(new Event("auth:logout"));
      window.location.href = "/login";
    }

    if (status !== 401) toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
