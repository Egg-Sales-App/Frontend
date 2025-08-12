import { apiService } from "./api";

export const paymentService = {
  // Get all payments
  async getPayments(params = {}) {
    try {
      const response = await apiService.get("/payments/", {
        page: params.page || 1,
        page_size: params.limit || 20,
        ordering: params.ordering || "-payment_date",
        is_successful: params.isSuccessful,
      });

      return {
        payments: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 20)),
        },
        total: response.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments");
    }
  },

  // Get single payment
  async getPayment(id) {
    try {
      const response = await apiService.get(`/payments/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch payment");
    }
  },

  // Create new payment
  async createPayment(paymentData) {
    try {
      const response = await apiService.post("/payments/", {
        order: paymentData.orderId,
        amount: parseFloat(paymentData.amount),
        payment_method: paymentData.paymentMethod,
        is_successful: paymentData.isSuccessful !== false,
      });

      return {
        success: true,
        payment: response,
        message: "Payment recorded successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to record payment");
    }
  },

  // Update payment status
  async updatePayment(id, paymentData) {
    try {
      const response = await apiService.patch(`/payments/${id}/`, {
        amount: parseFloat(paymentData.amount),
        payment_method: paymentData.paymentMethod,
        is_successful: paymentData.isSuccessful,
      });

      return {
        success: true,
        payment: response,
        message: "Payment updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update payment");
    }
  },

  // Delete payment
  async deletePayment(id) {
    try {
      await apiService.delete(`/payments/${id}/`);

      return {
        success: true,
        message: "Payment deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete payment");
    }
  },

  // Get payments for an order
  async getOrderPayments(orderId) {
    try {
      const response = await apiService.get("/payments/", {
        order: orderId,
        page_size: 100,
      });

      return response.results || [];
    } catch (error) {
      throw new Error("Failed to fetch order payments");
    }
  },

  // Get payment statistics
  async getPaymentStats() {
    try {
      const response = await apiService.get("/payments/", {
        page_size: 1000,
      });

      const payments = response.results || [];
      const successfulPayments = payments.filter((p) => p.is_successful);
      const totalAmount = successfulPayments.reduce(
        (sum, p) => sum + parseFloat(p.amount || 0),
        0
      );

      return {
        totalPayments: payments.length,
        successfulPayments: successfulPayments.length,
        failedPayments: payments.length - successfulPayments.length,
        totalAmount,
        averageAmount:
          successfulPayments.length > 0
            ? totalAmount / successfulPayments.length
            : 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch payment statistics");
    }
  },
};
