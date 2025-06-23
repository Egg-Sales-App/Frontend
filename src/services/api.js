import { config } from "../config/environment";

class ApiService {
  constructor(baseURL = config.API_BASE_URL) {
    this.baseURL = baseURL;
  }

  getAuthToken() {
    return localStorage.getItem(config.TOKEN_KEY);
  }

  setAuthToken(token) {
    localStorage.setItem(config.TOKEN_KEY, token);
  }

  removeAuthToken() {
    localStorage.removeItem(config.TOKEN_KEY);
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

    try {
      const response = await fetch(url, requestConfig);

      // Handle unauthorized access
      if (response.status === 401) {
        this.removeAuthToken();
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );

        // Attach validation errors if present
        if (errorData.validationErrors) {
          error.validationErrors = errorData.validationErrors;
        }

        throw error;
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        return { success: true };
      }
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request with query parameters
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append("file", file);

    // Add additional form data
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    const token = this.getAuthToken();

    return this.request(endpoint, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
  }
}

export const apiService = new ApiService();
