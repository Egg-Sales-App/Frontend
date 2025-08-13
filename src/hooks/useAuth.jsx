import { useState, useContext, createContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token first
        if (!authService.isAuthenticated()) {
          setIsLoading(false);
          return;
        }

        // Try to get current user from backend
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("No valid session:", error.message);
        // Clear invalid tokens
        authService.removeAuthToken();
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      console.log("🔐 Starting login process...");
      const response = await authService.login(credentials);

      console.log("✅ Login successful, updating auth state:", {
        userId: response.user.id,
        username: response.user.username,
        role: response.user.role,
        redirectTo: response.redirectTo,
      });

      setUser(response.user);
      setIsAuthenticated(true);

      // Return response with redirect information
      return {
        success: true,
        user: response.user,
        redirectTo: response.redirectTo,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ Login failed in useAuth:", error.message);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("🚪 Starting logout process from useAuth...");
      const result = await authService.logout();
      console.log("✅ Logout completed:", result);

      return result; // Return the result so components can use the message
    } catch (error) {
      console.error("❌ Logout error in useAuth:", error);
      // Even if there's an error, we'll clear the state since session is killed
      return {
        success: true,
        message: "Logged out successfully",
      };
    } finally {
      // Always clear local state since we kill the session locally
      console.log("🧹 Clearing auth state in useAuth...");
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      console.log("📝 Starting registration process...");
      const response = await authService.register(userData);
      console.log("✅ Registration successful:", response.message);
      return response;
    } catch (error) {
      console.error("❌ Registration failed in useAuth:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
