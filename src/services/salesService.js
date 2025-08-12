import { apiService } from "./api";

export const salesService = {
  // Get all orders/sales
  async getSales(params = {}) {
    try {
      const response = await apiService.get("/orders/", {
        page: params.page || 1,
        page_size: params.limit || 20,
        ordering: params.ordering || "-order_date",
        is_paid: params.isPaid,
      });

      return {
        sales: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 20)),
        },
        total: response.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch sales");
    }
  },

  // Create new order/sale
  async createSale(saleData) {
    try {
      // First create the order
      const orderResponse = await apiService.post("/orders/", {
        customer: saleData.customerId || null,
        guest_name: saleData.guestName || null,
        guest_contact: saleData.guestContact || null,
      });

      // Then add order items
      const orderItems = await Promise.all(
        saleData.items.map((item) =>
          apiService.post("/order-items/", {
            order: orderResponse.id,
            product: item.productId,
            quantity: item.quantity,
            price_at_purchase: item.price,
          })
        )
      );

      // Create payment if provided
      if (saleData.paymentMethod) {
        await apiService.post("/payments/", {
          order: orderResponse.id,
          amount: saleData.totalAmount,
          payment_method: saleData.paymentMethod,
          is_successful: true,
        });
      }

      return {
        success: true,
        sale: orderResponse,
        items: orderItems,
        message: "Sale created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create sale");
    }
  },

  // Get sales statistics (simplified for now)
  async getSalesStats(period = "30d") {
    try {
      // Get basic order statistics
      const response = await apiService.get("/orders/", {
        page_size: 1000, // Get all orders for stats
      });

      const orders = response.results || [];
      const totalSales = orders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );
      const totalOrders = orders.length;
      const paidOrders = orders.filter((order) => order.is_paid).length;

      return {
        totalSales,
        totalOrders,
        paidOrders,
        pendingOrders: totalOrders - paidOrders,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch sales statistics");
    }
  },

  // Get order details
  async getOrderDetails(orderId) {
    try {
      const [order, items] = await Promise.all([
        apiService.get(`/orders/${orderId}/`),
        apiService.get(`/order-items/`, { order: orderId }),
      ]);

      return {
        ...order,
        items: items.results || [],
      };
    } catch (error) {
      throw new Error("Failed to fetch order details");
    }
  },

  // Update order payment status
  async updatePaymentStatus(orderId, isPaid = true) {
    try {
      const response = await apiService.patch(`/orders/${orderId}/`, {
        is_paid: isPaid,
      });

      return {
        success: true,
        order: response,
        message: `Order marked as ${isPaid ? "paid" : "unpaid"}`,
      };
    } catch (error) {
      throw new Error("Failed to update payment status");
    }
  },
};
