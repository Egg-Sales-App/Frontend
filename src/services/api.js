import { config } from "../config/environment";

class ApiService {
  constructor(baseURL = config.API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = config.API_TIMEOUT || 10000;
  }

  getAuthToken() {
    return localStorage.getItem(config.TOKEN_KEY || "auth_token");
  }

  setAuthToken(token) {
    localStorage.setItem(config.TOKEN_KEY || "auth_token", token);
  }

  removeAuthToken() {
    localStorage.removeItem(config.TOKEN_KEY || "auth_token");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    console.log(`🌐 API Request: ${options.method || "GET"} ${url}`, {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
    });

    const requestConfig = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    requestConfig.signal = controller.signal;

    try {
      const response = await fetch(url, requestConfig);
      clearTimeout(timeoutId);

      console.log(`📡 API Response: ${options.method || "GET"} ${url}`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // Check if this is a token expiration error
      if (response.status === 401 || response.status === 403) {
        let errorData;
        try {
          errorData = await response.json();
          console.log("🔍 Auth error details:", errorData);
        } catch (e) {
          errorData = {};
        }

        // Check for token expiration
        const isTokenExpired =
          errorData.code === "token_not_valid" ||
          errorData.detail?.includes("expired") ||
          errorData.detail?.includes("not valid") ||
          response.status === 401;

        if (isTokenExpired) {
          console.log("⏰ Token expired, attempting refresh...");
          this.removeAuthToken();

          // Try to refresh token
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            try {
              console.log("🔄 Refreshing token...");
              const refreshResponse = await fetch(
                `${this.baseURL}/token/refresh/`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refresh: refreshToken }),
                }
              );

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                console.log("✅ Token refreshed successfully");
                this.setAuthToken(refreshData.access);

                // Retry original request with new token
                console.log("🔁 Retrying original request with new token...");
                requestConfig.headers.Authorization = `Bearer ${refreshData.access}`;
                delete requestConfig.signal; // Remove the old signal

                const retryResponse = await fetch(url, requestConfig);
                console.log(`📡 Retry response: ${retryResponse.status}`);

                if (retryResponse.ok) {
                  const contentType = retryResponse.headers.get("content-type");
                  if (contentType && contentType.includes("application/json")) {
                    return await retryResponse.json();
                  }
                  return { success: true };
                } else {
                  const retryError = await retryResponse
                    .json()
                    .catch(() => ({}));
                  console.error("❌ Retry request failed:", retryError);
                  throw new Error(
                    retryError.message ||
                      `Retry failed: ${retryResponse.status}`
                  );
                }
              } else {
                const refreshError = await refreshResponse
                  .json()
                  .catch(() => ({}));
                console.error("❌ Token refresh failed:", refreshError);
              }
            } catch (refreshError) {
              console.error("❌ Token refresh error:", refreshError);
            }
          } else {
            console.log("⚠️ No refresh token available");
          }

          // If we get here, refresh failed
          console.log("🚪 Redirecting to login due to auth failure");
          window.location.href = "/login";
          throw new Error("Session expired - Please login again");
        }

        throw new Error(
          errorData.detail || "Forbidden - Insufficient permissions"
        );
      }

      if (response.status === 404) {
        throw new Error("Not Found - Endpoint does not exist");
      }

      if (response.status >= 500) {
        throw new Error("Server Error - Please try again later");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        throw new Error(
          errorData.message ||
            errorData.error ||
            errorData.detail ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Handle empty responses
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return { success: true };
      }

      // Parse JSON response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        console.log(`✅ API Success: ${options.method || "GET"} ${url}`, {
          hasData: !!responseData,
          dataType: Array.isArray(responseData) ? "array" : typeof responseData,
        });
        return responseData;
      } else {
        return { success: true, text: await response.text() };
      }
    } catch (error) {
      clearTimeout(timeoutId);

      console.error(`❌ API Request Error: ${options.method || "GET"} ${url}`, {
        message: error.message,
        name: error.name,
      });

      if (error.name === "AbortError") {
        throw new Error("Request timeout - Check your connection");
      }

      if (error.message === "Failed to fetch") {
        throw new Error("Network error - Is the backend running?");
      }

      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
