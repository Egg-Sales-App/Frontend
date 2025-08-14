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
    localStorage.removeItem("user"); // Also remove user data stored by getCurrentUser
    console.log("🧹 All authentication data cleared from localStorage");
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
          isSuperuser: userProfile.is_superuser,
          role: userProfile.role,
        });

        // Determine redirect path based on user role
        const redirectTo = userProfile.is_superuser
          ? "/admin/dashboard"
          : "/pos";
        console.log(
          `🎯 Redirect path determined: ${redirectTo} (superuser: ${userProfile.is_superuser})`
        );

        const loginResult = {
          success: true,
          user: userProfile,
          token: response.access,
          refreshToken: response.refresh,
          message: "Login successful",
          redirectTo: redirectTo,
        };

        console.log("🎉 Login completed successfully:", {
          userId: userProfile.id,
          username: userProfile.username,
          hasToken: !!loginResult.token,
          redirectTo: redirectTo,
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

      // Extract meaningful error messages
      let errorMessage = "Login failed";

      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors[0]
            : errorData.non_field_errors;
        } else if (errorData.username) {
          errorMessage = Array.isArray(errorData.username)
            ? errorData.username[0]
            : errorData.username;
        } else if (errorData.password) {
          errorMessage = Array.isArray(errorData.password)
            ? errorData.password[0]
            : errorData.password;
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.response?.status === 400) {
        errorMessage = "Please check your login credentials";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      }

      const loginError = new Error(errorMessage);
      loginError.statusCode = error.response?.status;
      loginError.originalError = error;
      throw loginError;
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

        // Extract meaningful error messages
        let errorMessage = "Registration failed";
        let fieldErrors = {};

        if (errorData) {
          // Handle field-specific errors
          if (errorData.username) {
            fieldErrors.username = Array.isArray(errorData.username)
              ? errorData.username[0]
              : errorData.username;
            errorMessage = `Username: ${fieldErrors.username}`;
          }

          if (errorData.email) {
            fieldErrors.email = Array.isArray(errorData.email)
              ? errorData.email[0]
              : errorData.email;
            errorMessage = fieldErrors.username
              ? `${errorMessage}. Email: ${fieldErrors.email}`
              : `Email: ${fieldErrors.email}`;
          }

          if (errorData.password) {
            fieldErrors.password = Array.isArray(errorData.password)
              ? errorData.password[0]
              : errorData.password;
            errorMessage =
              fieldErrors.username || fieldErrors.email
                ? `${errorMessage}. Password: ${fieldErrors.password}`
                : `Password: ${fieldErrors.password}`;
          }

          // Handle general error messages
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.non_field_errors) {
            errorMessage = Array.isArray(errorData.non_field_errors)
              ? errorData.non_field_errors[0]
              : errorData.non_field_errors;
          }
        }

        const error = new Error(errorMessage);
        error.fieldErrors = fieldErrors;
        error.statusCode = response.status;
        error.rawErrorData = errorData;
        throw error;
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

      // Call backend logout endpoint to invalidate server-side session
      try {
        console.log("🌐 Calling backend logout endpoint...");
        console.log("🔧 Config debug:", {
          DJANGO_BASE_URL: config.DJANGO_BASE_URL,
          API_BASE_URL: config.API_BASE_URL,
        });

        // Use Django allauth logout endpoint
        const logoutUrl = `${config.DJANGO_BASE_URL}/accounts/logout/`;
        console.log("🔗 Django allauth Logout URL:", logoutUrl);

        const csrfResponse = await fetch(logoutUrl, {
          method: "GET",
          credentials: "include", // Include cookies for session
        });

        let csrfToken = null;
        if (csrfResponse.ok) {
          const htmlText = await csrfResponse.text();
          // Extract CSRF token from the HTML form
          const csrfMatch = htmlText.match(
            /name=['"]csrfmiddlewaretoken['"] value=['"]([^'"]+)['"]/
          );
          if (csrfMatch) {
            csrfToken = csrfMatch[1];
            console.log("🔐 CSRF token extracted from HTML form");
          }

          // Also try to get from cookies as backup
          const csrfCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="));

          if (csrfCookie && !csrfToken) {
            csrfToken = csrfCookie.split("=")[1];
            console.log("🔐 CSRF token obtained from cookie");
          }
        }

        if (csrfToken) {
          // Submit logout form with CSRF token
          const formData = new FormData();
          formData.append("csrfmiddlewaretoken", csrfToken);

          const logoutResponse = await fetch(logoutUrl, {
            method: "POST",
            credentials: "include", // Include cookies
            body: formData,
          });

          console.log("📡 Logout response:", {
            status: logoutResponse.status,
            statusText: logoutResponse.statusText,
            ok: logoutResponse.ok,
          });

          if (logoutResponse.ok) {
            console.log("✅ Server-side logout successful");
          } else {
            console.warn(
              "⚠️ Server logout returned non-OK status, but continuing..."
            );
          }
        } else {
          console.warn(
            "⚠️ Could not obtain CSRF token, skipping server logout"
          );
        }
      } catch (backendError) {
        console.warn(
          "⚠️ Backend logout failed, but continuing with client-side logout:",
          {
            message: backendError.message,
          }
        );
        // Continue with client-side logout even if backend fails
      }

      // Clear all local storage data - kill the session
      console.log("🧹 Clearing local authentication data...");
      this.removeAuthToken();

      console.log("✅ Logout completed successfully");

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

      // Try user endpoints based on API documentation
      const endpoints = [
        "/users/", // Get all users (we'll need to filter current user)
      ];

      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying user endpoint: ${endpoint}`);
          let userData = await apiService.get(endpoint);

          // Handle case where /users/ returns an array
          if (Array.isArray(userData)) {
            console.log(
              `📋 Endpoint ${endpoint} returned array with ${userData.length} users`
            );

            // Try to find current user from token
            const token = this.getAuthToken(); // Use the proper method to get token
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const currentUserId = payload.user_id;

                console.log(
                  "🔍 Looking for user with ID:",
                  currentUserId,
                  "in array of",
                  userData.length,
                  "users"
                );

                // Find user in the array by ID
                const currentUser = userData.find(
                  (user) => user.id === currentUserId
                );
                if (currentUser) {
                  console.log("✅ Found current user in array:", currentUser);

                  // Store user role information
                  const userWithRole = {
                    ...currentUser,
                    role: currentUser.is_superuser ? "admin" : "pos",
                  };

                  localStorage.setItem("user", JSON.stringify(userWithRole));
                  return userWithRole;
                } else {
                  console.warn(
                    `⚠️ User with ID ${currentUserId} not found in users array`
                  );
                  // Don't fall back to first user - this causes the wrong user login issue
                  throw new Error(`Current user not found in users list`);
                }
              } catch (tokenError) {
                console.warn("⚠️ Could not decode token:", tokenError);
                throw new Error("Invalid token - cannot identify current user");
              }
            } else {
              throw new Error("No authentication token available");
            }

            // Remove the fallback that was causing wrong user selection
            // if (userData.length > 0) {
            //   const fallbackUser = {
            //     ...userData[0],
            //     role: userData[0].is_superuser ? "admin" : "pos",
            //   };
            //   localStorage.setItem("user", JSON.stringify(fallbackUser));
            //   return fallbackUser;
            // }
          } else {
            // Single user object returned
            console.log(`✅ Endpoint ${endpoint} returned user:`, userData);
            const userWithRole = {
              ...userData,
              role: userData.is_superuser ? "admin" : "pos",
            };
            localStorage.setItem("user", JSON.stringify(userWithRole));
            return userWithRole;
          }

          console.log(`✅ Successfully fetched user from ${endpoint}`);
          return userData;
        } catch (error) {
          console.warn(`❌ Failed to fetch from ${endpoint}:`, error.message);
          lastError = error;
          continue;
        }
      }

      // If all endpoints fail, try to get user from stored token
      console.log(
        "⚠️ All user endpoints failed, attempting token-based user creation"
      );
      const token = this.getAuthToken(); // Use proper method to get token
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.warn(
            "⚠️ Using fallback user data from token - this should not happen in production"
          );
          const fallbackUser = {
            id: payload.user_id,
            username: payload.username || "Unknown",
            email: payload.email || "",
            is_supplier: false,
            is_superuser: false,
            role: "pos", // Default to pos role
          };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          return fallbackUser;
        } catch (error) {
          console.error("❌ Failed to decode token:", error);
          // If token is invalid, clear it
          this.removeAuthToken();
          throw new Error("Invalid authentication token");
        }
      }

      throw lastError || new Error("Unable to fetch user profile");
    } catch (error) {
      console.error("❌ Get current user failed:", error);
      throw error;
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

      // Enhanced error messages for token refresh
      let errorMessage = "Session expired. Please login again.";

      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid session. Please login again.";
      } else if (error.response?.status >= 500) {
        errorMessage =
          "Server error during session refresh. Please login again.";
      }

      // If refresh fails, logout user
      console.log("🚪 Token refresh failed, initiating logout...");
      this.logout();

      const refreshError = new Error(errorMessage);
      refreshError.statusCode = error.response?.status;
      refreshError.isTokenExpired = true;
      throw refreshError;
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
      const response = await apiService.get(`/verify-email/?token=${token}`);
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
