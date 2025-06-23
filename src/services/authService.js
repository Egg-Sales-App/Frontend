import { apiService } from "./api";

export const authService = {
  // Login with email/username and password
  async login(credentials) {
    try {
      const response = await apiService.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });

      if (response.token || response.accessToken) {
        const token = response.token || response.accessToken;
        apiService.setAuthToken(token);

        // Store user data if provided
        if (response.user) {
          localStorage.setItem("user_data", JSON.stringify(response.user));
        }
      }

      return {
        success: true,
        user: response.user,
        token: response.token || response.accessToken,
        message: response.message || "Login successful",
      };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post("/auth/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: userData.role || "employee",
        department: userData.department,
      });

      return {
        success: true,
        message: response.message || "Registration successful",
        user: response.user,
      };
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  },

  // Logout user
  async logout() {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove token from localStorage
      apiService.removeAuthToken();
      localStorage.removeItem("user_data");
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiService.get("/auth/me");
      return response.user || response;
    } catch (error) {
      throw new Error("Failed to get current user");
    }
  },

  // Refresh authentication token
  async refreshToken() {
    try {
      const response = await apiService.post("/auth/refresh");

      if (response.token || response.accessToken) {
        const token = response.token || response.accessToken;
        apiService.setAuthToken(token);
      }

      return response;
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  },

  // Request password reset
  async forgotPassword(email) {
    try {
      const response = await apiService.post("/auth/forgot-password", {
        email,
      });
      return {
        success: true,
        message: response.message || "Password reset email sent",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to send reset email");
    }
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post("/auth/reset-password", {
        token,
        password: newPassword,
        confirmPassword: newPassword,
      });

      return {
        success: true,
        message: response.message || "Password reset successful",
      };
    } catch (error) {
      throw new Error(error.message || "Password reset failed");
    }
  },

  // Change password for authenticated user
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });

      return {
        success: true,
        message: response.message || "Password changed successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Password change failed");
    }
  },

  // Verify email address
  async verifyEmail(token) {
    try {
      const response = await apiService.post("/auth/verify-email", { token });
      return {
        success: true,
        message: response.message || "Email verified successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Email verification failed");
    }
  },
};
