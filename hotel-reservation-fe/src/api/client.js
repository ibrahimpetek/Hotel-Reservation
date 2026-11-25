import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:9090";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("hotel_staff_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && window.location.pathname.startsWith("/admin")) {
      // Token gecersiz/suresi dolmus -> oturumu temizleyip login'e at.
      localStorage.removeItem("hotel_staff_token");
      localStorage.removeItem("hotel_staff_info");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    const backendMessage = error?.response?.data?.message;
    const fieldErrors = error?.response?.data?.fieldErrors;
    const message =
      backendMessage ||
      (fieldErrors && fieldErrors.length > 0 ? fieldErrors[0].message : null) ||
      error.message ||
      "Beklenmeyen bir hata olustu.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;