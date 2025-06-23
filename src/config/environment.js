export const config = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Poultry Store",
  NODE_ENV: import.meta.env.MODE,
  TOKEN_KEY: "poultry_auth_token",
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true",
};

// Debug logging
if (config.ENABLE_DEBUG) {
  console.log("App Configuration:", {
    API_BASE_URL: config.API_BASE_URL,
    NODE_ENV: config.NODE_ENV,
    API_TIMEOUT: config.API_TIMEOUT,
  });
}
