import { apiService } from "./api";
import { config } from "../config/environment";

export const authService = {
  // Token management methods
  getAuthToken() {
    return apiService.getAuthToken();
  },

  setAuthToken(token) {
    return apiService.setAuthToken(token);
  },

  removeAuthToken() {
    apiService.removeAuthToken();
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
  },

  // Login with email/username and password
  async login(credentials) {
    try {
      console.log("🔐 Attempting login with credentials:", {
        username: credentials.email || credentials.username,
        hasPassword: !!credentials.password,
      });

      // Use Django's JWT token endpoint
      const response = await apiService.post("/token/", {
        username: credentials.email || credentials.username,
        password: credentials.password,
      });

      console.log("✅ Backend login response:", {
        hasAccess: !!response.access,
        hasRefresh: !!response.refresh,
        tokenPreview: response.access
          ? `${response.access.substring(0, 20)}...`
          : null,
        fullResponse: response,
      });

      if (response.access) {
        apiService.setAuthToken(response.access);

        // Store refresh token
        if (response.refresh) {
          localStorage.setItem("refresh_token", response.refresh);
          console.log("💾 Refresh token stored successfully");
        }

        // Get user profile after login
        console.log("👤 Fetching user profile...");
        const userProfile = await this.getCurrentUser();
        console.log("✅ User profile retrieved:", {
          id: userProfile.id,
          username: userProfile.username,
          email: userProfile.email,
          isStaff: userProfile.is_staff,
        });

        const loginResult = {
          success: true,
          user: userProfile,
          token: response.access,
          refreshToken: response.refresh,
          message: "Login successful",
        };

        console.log("🎉 Login completed successfully:", {
          userId: userProfile.id,
          username: userProfile.username,
          hasToken: !!loginResult.token,
        });

        return loginResult;
      }

      throw new Error("No access token received");
    } catch (error) {
      console.error("❌ Login failed:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });
      throw new Error(error.message || "Login failed");
    }
  },

  // Register new user
  async register(userData) {
    try {
      console.log("📝 Attempting user registration:", {
        username: userData.username || userData.email,
        email: userData.email,
        hasPassword: !!userData.password,
        isSupplier: userData.isSupplier || false,
      });

      const registrationData = {
        username: userData.username || userData.email,
        email: userData.email,
        password: userData.password,
        is_supplier: userData.isSupplier || false,
      };

      // Use API signup endpoint
      const response = await fetch(`${config.API_BASE_URL}/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      console.log("📡 Registration response status:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Registration failed:", {
          status: response.status,
          errorData: errorData,
        });
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json().catch(() => ({ success: true }));
      console.log("✅ Registration successful:", {
        hasUser: !!data.user,
        message: data.message,
        fullResponse: data,
      });

      return {
        success: true,
        message:
          data.message ||
          "Registration successful. Please check your email for verification.",
        user: data.user,
      };
    } catch (error) {
      console.error("❌ Registration error:", {
        message: error.message,
        name: error.name,
      });
      throw new Error(error.message || "Registration failed");
    }
  },

  // Logout user
  async logout() {
    try {
      console.log("🚪 Starting logout process...");

      const refreshToken = localStorage.getItem("refresh_token");
      const authToken = this.getAuthToken();

      console.log("📊 Logout state:", {
        hasAuthToken: !!authToken,
        hasRefreshToken: !!refreshToken,
      });

      // Simply clear all local storage data - kill the session
      console.log("🧹 Clearing local authentication data...");
      this.removeAuthToken();

      console.log("✅ Session killed successfully");

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("❌ Logout error:", {
        message: error.message,
        name: error.name,
      });

      // Force clear local data even if there's an error
      console.log("🧹 Force clearing local data due to logout error...");
      this.removeAuthToken();

      return {
        success: true, // Still return success since we cleared local data
        message: "Logged out successfully",
      };
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      console.log("👤 Fetching current user profile...");

      // For Django Simple JWT, try common user endpoints
      const endpoints = [
        "/user/",
        "/users/me/",
        "/auth/user/",
        "/user/",
        "/dj-rest-auth/user/",
        "/api/auth/user/",
        "/accounts/user/",
      ];

      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying user endpoint: ${endpoint}`);
          response = await apiService.get(endpoint);
          console.log(`✅ Success with endpoint: ${endpoint}`, {
            id: response.id,
            username: response.username,
            email: response.email,
          });
          break;
        } catch (error) {
          console.log(`❌ Failed endpoint ${endpoint}:`, error.message);
          lastError = error;
          continue;
        }
      }

      if (!response) {
        // If all endpoints fail, create a minimal user object from the token
        console.warn(
          "⚠️ All user endpoints failed, creating minimal user object from token"
        );
        const token = this.getAuthToken();
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("🔓 Decoded token payload:", {
              userId: payload.user_id,
              exp: payload.exp,
              iat: payload.iat,
            });
            response = {
              id: payload.user_id,
              username: `user_${payload.user_id}`,
              email: `user${payload.user_id}@example.com`,
              is_staff: false,
            };
            console.log("✅ Created fallback user object:", response);
          } catch (decodeError) {
            console.error("❌ Failed to decode token:", decodeError.message);
            throw new Error(
              "All user endpoints failed and couldn't decode token"
            );
          }
        } else {
          console.error("❌ No auth token available");
          throw lastError || new Error("No auth token available");
        }
      }

      // Store user data locally
      localStorage.setItem("user_data", JSON.stringify(response));
      console.log("💾 User data stored locally:", {
        id: response.id,
        username: response.username,
        isStaff: response.is_staff,
      });

      return response;
    } catch (error) {
      console.error("❌ Failed to get current user:", {
        message: error.message,
        name: error.name,
      });
      throw new Error("Failed to get current user: " + error.message);
    }
  },

  // Refresh authentication token
  async refreshToken() {
    try {
      console.log("🔄 Attempting to refresh authentication token...");

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        console.error("❌ No refresh token available");
        throw new Error("No refresh token available");
      }

      console.log("📡 Sending refresh token request...");
      const response = await apiService.post("/token/refresh/", {
        refresh: refreshToken,
      });

      console.log("✅ Token refresh response:", {
        hasAccess: !!response.access,
        accessTokenPreview: response.access
          ? `${response.access.substring(0, 20)}...`
          : null,
      });

      if (response.access) {
        apiService.setAuthToken(response.access);
        console.log("💾 New access token stored successfully");
        return response.access;
      }

      console.error("❌ Token refresh failed - no access token in response");
      throw new Error("Token refresh failed");
    } catch (error) {
      console.error("❌ Token refresh error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      // If refresh fails, logout user
      console.log("🚪 Token refresh failed, initiating logout...");
      this.logout();
      throw new Error("Session expired. Please login again.");
    }
  },

  // Request password reset
  async forgotPassword(email) {
    try {
      // API password reset endpoint (if available)
      const response = await fetch(`${config.API_BASE_URL}/password/reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      return {
        success: true,
        message: "Password reset email sent",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to send reset email");
    }
  },

  // Change password for authenticated user
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post("/auth/change-password/", {
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

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    if (!token) {
      console.log("🔍 No auth token found");
      return false;
    }

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;

      console.log("🔍 Token validation:", {
        userId: payload.user_id,
        exp: payload.exp,
        currentTime: currentTime,
        isExpired: isExpired,
        expiresIn: payload.exp - currentTime,
      });

      if (isExpired) {
        console.log("⏰ Token is expired, removing...");
        this.removeAuthToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Token validation error:", error);
      this.removeAuthToken();
      return false;
    }
  },

  // Get token expiration info
  getTokenInfo() {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return {
        userId: payload.user_id,
        exp: payload.exp,
        iat: payload.iat,
        isExpired: payload.exp < currentTime,
        expiresIn: payload.exp - currentTime,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
      };
    } catch (error) {
      console.error("❌ Failed to decode token:", error);
      return null;
    }
  },

  // Get stored user data
  getCurrentUserFromStorage() {
    try {
      const userData = localStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },
};
