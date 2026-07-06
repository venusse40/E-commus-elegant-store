import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("Elegant-Store_token")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On first load, if a token exists, try to fetch the current user
  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem("Elegant-Store_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const me = await getCurrentUser();
        setUser(me.data || me.user || me);
      } catch (err) {
        localStorage.removeItem("Elegant-Store_token");
        localStorage.removeItem("Elegant-Store_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async ({ email, password }) => {
    setError(null);
    try {
      const data = await loginUser({ email, password });
const authToken = data.data.token;
const authUser = data.data.user;
      localStorage.setItem("Elegant-Store_token", authToken);
      localStorage.setItem("Elegant-Store_user", JSON.stringify(authUser));
      setToken(authToken);
      setUser(authUser);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async ({ email, password, role }) => {
    setError(null);
    try {
      const data = await registerUser({ email, password, role });
      return { success: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("Elegant-Store_token");
    localStorage.removeItem("Elegant-Store_user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}