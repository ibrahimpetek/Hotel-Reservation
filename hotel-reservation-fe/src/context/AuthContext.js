import { createContext, useContext, useMemo, useState } from "react";
import { staffLogin } from "../api/adminApi";

const TOKEN_KEY = "hotel_staff_token";
const INFO_KEY = "hotel_staff_info";

const AuthContext = createContext(null);

function loadStoredStaff() {
  try {
    const raw = localStorage.getItem(INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}


export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(loadStoredStaff);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = async (email, password) => {
    const response = await staffLogin(email, password);
    const staffInfo = {
      email: response.email,
      fullName: response.fullName,
      role: response.role,
    };
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(INFO_KEY, JSON.stringify(staffInfo));
    setToken(response.token);
    setStaff(staffInfo);
    return staffInfo;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INFO_KEY);
    setToken(null);
    setStaff(null);
  };

  const value = useMemo(
    () => ({
      staff,
      token,
      isAuthenticated: !!token,
      isAdmin: staff?.role === "ADMIN",
      login,
      logout,
    }),
    [staff, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalıdır");
  }
  return ctx;
}

