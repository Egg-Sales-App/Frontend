import { config } from "../config/environment";

import { apiService } from "./api";

export const authService = {
  async login(credentials) {
    try {
      const response = await apiService.post("/auth/login", credentials);

      if (response.token) {
        apiService.setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  async register(userData) {
    try {
      const response = await apiService.post("/auth/register", userData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  },

  async logout() {
    try {
      // Call logout endpoint if your backend requires it
      await apiService.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove token from localStorage
      apiService.removeAuthToken();
    }
  },

  async getCurrentUser() {
    try {
      return await apiService.get("/auth/me");
    } catch (error) {
      throw new Error("Failed to get current user");
    }
  },

  async refreshToken() {
    try {
      const response = await apiService.post("/auth/refresh");

      if (response.token) {
        apiService.setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  },

  async forgotPassword(email) {
    try {
      return await apiService.post("/auth/forgot-password", { email });
    } catch (error) {
      throw new Error(error.message || "Failed to send reset email");
    }
  },

  async resetPassword(token, newPassword) {
    try {
      return await apiService.post("/auth/reset-password", {
        token,
        password: newPassword,
      });
    } catch (error) {
      throw new Error(error.message || "Password reset failed");
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      return await apiService.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw new Error(error.message || "Password change failed");
    }
  },
};
