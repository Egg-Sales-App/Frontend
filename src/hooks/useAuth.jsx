import { useState, useContext, createContext, useEffect } from "react";
import { authService } from "../services/authService";

// Create an AuthContext for managing authentication state across the app
const AuthContext = createContext();

/**
 * Custom hook to access the authentication context.
 * - Ensures components only use auth if wrapped in AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider wraps your application and provides:
 * - user info
 * - authentication status
 * - login, logout, and register functions
 */
export const AuthProvider = ({ children }) => {
  // Stores logged-in user data
  const [user, setUser] = useState(null);

  // Shows loading spinner when auth state is being checked
  const [isLoading, setIsLoading] = useState(true);

  // Tracks if a user is currently authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * On app startup, check if user is already logged in.
   * - Validates token.
   * - If valid, retrieves user info.
   * - If invalid, clears local auth state.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If no valid token, exit early
        if (!authService.isAuthenticated()) {
          setIsLoading(false);
          return;
        }

        // Otherwise, get the current logged-in user from backend
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("No valid session:", error.message);

        // If session is invalid, remove token & reset auth state
        authService.removeAuthToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Stop loading after check
      }
    };

    checkAuth();
  }, []);

  /**
   * Handle user login
   * - Sends credentials to backend via authService.
   * - On success, updates user and sets authenticated state.
   * - Returns useful response including redirect target.
   */
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

      return {
        success: true,
        user: response.user,
        redirectTo: response.redirectTo,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ Login failed in useAuth:", error.message);
      setIsAuthenticated(false);
      throw error; // Let component handle error (e.g., toast)
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   * - Calls backend logout endpoint.
   * - Clears local auth state regardless of success/failure.
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("🚪 Starting logout process from useAuth...");
      const result = await authService.logout();
      console.log("✅ Logout completed:", result);

      return result; // Pass message back to UI
    } catch (error) {
      console.error("❌ Logout error in useAuth:", error);

      // Even if backend fails, clear local state anyway
      return {
        success: true,
        message: "Logged out successfully",
      };
    } finally {
      console.log("🧹 Clearing auth state in useAuth...");
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration
   * - Calls backend registration API.
   * - Returns response (e.g., success message or error).
   */
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

  // Values available to all components using useAuth()
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  // Provide auth state and functions to child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
