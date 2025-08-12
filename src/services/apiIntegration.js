import { apiService } from "./api";

/**
 * Comprehensive API Integration Service
 * Maps all backend endpoints to frontend service methods
 */
export const apiIntegration = {
  // Products endpoints
  products: {
    async getAll(params = {}) {
      return await apiService.get("/products/", params);
    },

    async getById(id) {
      return await apiService.get(`/products/${id}/`);
    },

    async create(data) {
      return await apiService.post("/products/", data);
    },

    async update(id, data) {
      return await apiService.put(`/products/${id}/`, data);
    },

    async delete(id) {
      return await apiService.delete(`/products/${id}/`);
    },
  },

  // Orders endpoints
  orders: {
    async getAll(params = {}) {
      return await apiService.get("/orders/", params);
    },

    async getById(id) {
      return await apiService.get(`/orders/${id}/`);
    },

    async create(data) {
      return await apiService.post("/orders/", data);
    },

    async update(id, data) {
      return await apiService.put(`/orders/${id}/`, data);
    },

    async delete(id) {
      return await apiService.delete(`/orders/${id}/`);
    },
  },

  // Inventory endpoints
  inventory: {
    async getAll(params = {}) {
      return await apiService.get("/inventory/", params);
    },

    async getById(id) {
      return await apiService.get(`/inventory/${id}/`);
    },

    async update(id, data) {
      return await apiService.put(`/inventory/${id}/`, data);
    },
  },

  // Payments endpoints
  payments: {
    async getAll(params = {}) {
      return await apiService.get("/payments/", params);
    },

    async create(data) {
      return await apiService.post("/payments/", data);
    },

    async getById(id) {
      return await apiService.get(`/payments/${id}/`);
    },
  },

  // Deliveries endpoints
  deliveries: {
    async getAll(params = {}) {
      return await apiService.get("/deliveries/", params);
    },

    async create(data) {
      return await apiService.post("/deliveries/", data);
    },

    async getById(id) {
      return await apiService.get(`/deliveries/${id}/`);
    },

    async update(id, data) {
      return await apiService.put(`/deliveries/${id}/`, data);
    },
  },

  // Users endpoints (for user management)
  users: {
    async getAll(params = {}) {
      return await apiService.get("/users/", params);
    },

    async getById(id) {
      return await apiService.get(`/users/${id}/`);
    },

    async update(id, data) {
      return await apiService.put(`/users/${id}/`, data);
    },
  },

  // Authentication endpoints (already handled in authService)
  auth: {
    async getToken(credentials) {
      return await apiService.post("/token/", credentials);
    },

    async refreshToken(refreshToken) {
      return await apiService.post("/token/refresh/", {
        refresh: refreshToken,
      });
    },
  },

  // Dashboard aggregated data
  dashboard: {
    async getSummary() {
      try {
        // Fetch data from multiple endpoints for dashboard
        const [products, orders, inventory, payments, deliveries] =
          await Promise.allSettled([
            this.products.getAll({ page_size: 1 }), // Just get count
            this.orders.getAll({ page_size: 1 }), // Just get count
            this.inventory.getAll({ page_size: 1 }), // Just get count
            this.payments.getAll({ page_size: 1 }), // Just get count
            this.deliveries.getAll({ page_size: 1 }), // Just get count
          ]);

        return {
          products:
            products.status === "fulfilled" ? products.value : { count: 0 },
          orders: orders.status === "fulfilled" ? orders.value : { count: 0 },
          inventory:
            inventory.status === "fulfilled" ? inventory.value : { count: 0 },
          payments:
            payments.status === "fulfilled" ? payments.value : { count: 0 },
          deliveries:
            deliveries.status === "fulfilled" ? deliveries.value : { count: 0 },
        };
      } catch (error) {
        console.error("Dashboard summary error:", error);
        return {
          products: { count: 0 },
          orders: { count: 0 },
          inventory: { count: 0 },
          payments: { count: 0 },
          deliveries: { count: 0 },
        };
      }
    },
  },

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await apiService.get("/");
      return response;
    } catch (error) {
      console.error("API health check failed:", error);
      return { status: "error", message: error.message };
    }
  },
};

export default apiIntegration;
