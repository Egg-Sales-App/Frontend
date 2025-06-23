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

      // Handle different response status codes
      if (response.status === 401) {
        this.removeAuthToken();
        throw new Error("Unauthorized - Please login again");
      }

      if (response.status === 403) {
        throw new Error("Forbidden - Insufficient permissions");
      }

      if (response.status === 404) {
        throw new Error("Not Found - Endpoint does not exist");
      }

      if (response.status >= 500) {
        throw new Error("Server Error - Please try again later");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
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
        return await response.json();
      } else {
        return { success: true, text: await response.text() };
      }
    } catch (error) {
      clearTimeout(timeoutId);

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
