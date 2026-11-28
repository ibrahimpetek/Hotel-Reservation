import axios from "axios";

// NOT (paket): axios -> `npm install axios`
// CRA'da env degiskenleri import.meta.env DEGIL process.env ile okunur
// ve mutlaka "REACT_APP_" prefix'i tasimalidir (bkz. .env.example).
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8090";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin/resepsiyon panelindeki her istege, giris yapilmissa JWT token'i
// otomatik ekler. Token AuthContext tarafindan localStorage'a yazilir
// (bkz. src/context/AuthContext.jsx, anahtar: "hotel_staff_token").
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("hotel_staff_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Backend'den donen ErrorResponse formatini ({message, fieldErrors, ...})
// tek tip bir Error nesnesine cevirir, boylece component'lerde tutarli
// sekilde catch(err) { err.message } kullanilabilir.
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