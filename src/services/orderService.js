import { apiService } from "./api";

export const orderService = {
  // Create a new order
  async createOrder(orderData) {
    try {
      const response = await apiService.post("/orders/", {
        ref_code: `POS_${Date.now()}`,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        order_date: orderData.order_date,
        total_amount: orderData.total_amount,
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_status,
        items: orderData.items,
      });
      return response;
    } catch (error) {
      throw new Error("Failed to create order");
    }
  },

  // Get all orders
  async getOrders(params = {}) {
    try {
      const response = await apiService.get("/orders/", {
        page: params.page || 1,
        page_size: params.limit || 50,
        search: params.search,
        date_from: params.dateFrom,
        date_to: params.dateTo,
      });
      return response || [];
    } catch (error) {
      throw new Error("Failed to fetch orders");
    }
  },

  // Get single order
  async getOrder(id) {
    try {
      const response = await apiService.get(`/orders/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch order");
    }
  },

  // Update order status
  async updateOrderStatus(id, status) {
    try {
      const response = await apiService.patch(`/orders/${id}/`, {
        status: status,
      });
      return response;
    } catch (error) {
      throw new Error("Failed to update order status");
    }
  },

  // Cancel order
  async cancelOrder(id) {
    try {
      const response = await apiService.patch(`/orders/${id}/`, {
        status: "cancelled",
      });
      return response;
    } catch (error) {
      throw new Error("Failed to cancel order");
    }
  },
};
