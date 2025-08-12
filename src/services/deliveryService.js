import { apiService } from "./api";

export const deliveryService = {
  // Get all deliveries
  async getDeliveries(params = {}) {
    try {
      const response = await apiService.get("/deliveries/", {
        page: params.page || 1,
        page_size: params.limit || 20,
        ordering: params.ordering || "-delivery_date",
        delivered: params.delivered,
      });

      return {
        deliveries: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 20)),
        },
        total: response.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch deliveries");
    }
  },

  // Get single delivery
  async getDelivery(id) {
    try {
      const response = await apiService.get(`/deliveries/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch delivery");
    }
  },

  // Create new delivery
  async createDelivery(deliveryData) {
    try {
      const response = await apiService.post("/deliveries/", {
        order: deliveryData.orderId,
        delivery_address: deliveryData.address,
        delivery_date: deliveryData.deliveryDate,
        delivered: false,
      });

      return {
        success: true,
        delivery: response,
        message: "Delivery scheduled successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to schedule delivery");
    }
  },

  // Update delivery
  async updateDelivery(id, deliveryData) {
    try {
      const response = await apiService.patch(`/deliveries/${id}/`, {
        delivery_address: deliveryData.address,
        delivery_date: deliveryData.deliveryDate,
        delivered: deliveryData.delivered,
      });

      return {
        success: true,
        delivery: response,
        message: "Delivery updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update delivery");
    }
  },

  // Mark delivery as completed
  async markDelivered(id) {
    try {
      const response = await apiService.patch(`/deliveries/${id}/`, {
        delivered: true,
      });

      return {
        success: true,
        delivery: response,
        message: "Delivery marked as completed",
      };
    } catch (error) {
      throw new Error("Failed to mark delivery as completed");
    }
  },

  // Delete delivery
  async deleteDelivery(id) {
    try {
      await apiService.delete(`/deliveries/${id}/`);

      return {
        success: true,
        message: "Delivery deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete delivery");
    }
  },

  // Get pending deliveries
  async getPendingDeliveries() {
    try {
      const response = await apiService.get("/deliveries/", {
        delivered: false,
        page_size: 100,
        ordering: "delivery_date",
      });

      return response.results || [];
    } catch (error) {
      throw new Error("Failed to fetch pending deliveries");
    }
  },

  // Get delivery statistics
  async getDeliveryStats() {
    try {
      const response = await apiService.get("/deliveries/", {
        page_size: 1000,
      });

      const deliveries = response.results || [];
      const completed = deliveries.filter((d) => d.delivered);
      const pending = deliveries.filter((d) => !d.delivered);

      return {
        totalDeliveries: deliveries.length,
        completedDeliveries: completed.length,
        pendingDeliveries: pending.length,
        completionRate:
          deliveries.length > 0
            ? (completed.length / deliveries.length) * 100
            : 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch delivery statistics");
    }
  },
};
