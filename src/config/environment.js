export const config = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://wc4kscgkwookowksgcs0g48s.213.199.60.135.sslip.io/api",
  DJANGO_BASE_URL:
    import.meta.env.VITE_DJANGO_BASE_URL ||
    "http://wc4kscgkwookowksgcs0g48s.213.199.60.135.sslip.io",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Poultry Store",
  NODE_ENV: import.meta.env.MODE,
  TOKEN_KEY: "poultry_auth_token",
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000,
  ENABLE_DEBUG:
    import.meta.env.VITE_ENABLE_DEBUG === "true" ||
    import.meta.env.MODE === "development",
};

// Debug logging
if (config.ENABLE_DEBUG) {
  console.log("🔧 App Configuration:", {
    API_BASE_URL: config.API_BASE_URL,
    DJANGO_BASE_URL: config.DJANGO_BASE_URL,
    NODE_ENV: config.NODE_ENV,
    API_TIMEOUT: config.API_TIMEOUT,
    ENABLE_DEBUG: config.ENABLE_DEBUG,
  });
}
