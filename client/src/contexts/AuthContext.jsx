import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for authentication on app load
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      // Check if user has a valid token in localStorage or sessionStorage
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        // Verify the token is still valid and fetch user data
        const response = await api.get("/auth/profile");

        if (response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.data);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Clear invalid token
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  const login = (token, userData) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
