import { createContext, useContext, useState, useEffect } from "react";

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
        // You can add an API call here to verify the token is still valid
        // For now, we'll just check if token exists
        setIsAuthenticated(true);
        // You might want to fetch user data here as well
        // const userData = await fetchUserData(token);
        // setUser(userData);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Clear invalid token
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
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
