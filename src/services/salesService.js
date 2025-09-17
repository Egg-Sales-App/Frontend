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

  // Get all order items for sales analysis
  async getOrderItems(params = {}) {
    try {
      const response = await apiService.get("/order-items/", {
        page: params.page || 1,
        page_size: params.limit || 100,
        ordering: params.ordering || "-id",
      });

      return {
        orderItems: response.results || response || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 100,
          total: response.count || response.length || 0,
          pages: Math.ceil(
            (response.count || response.length || 0) / (params.limit || 100)
          ),
        },
        total: response.count || response.length || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch order items");
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

  // Get sales chart data for visualization
  async getSalesChartData(period = "12m") {
    try {
      // Get all orders for chart analysis
      const response = await apiService.get("/orders/", {
        page_size: 1000, // Get all orders
        ordering: "-order_date",
      });

      const orders = response.results || [];

      // Process orders into monthly data for chart
      const monthlyData = this.processOrdersForChart(orders, period);

      return monthlyData;
    } catch (error) {
      throw new Error("Failed to fetch sales chart data");
    }
  },

  // Helper method to process orders into chart-friendly format
  processOrdersForChart(orders, period) {
    const now = new Date();
    const months = [];

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      months.push({
        month: monthName,
        monthKey: monthKey,
        ordered: 0,
        delivered: 0,
        revenue: 0,
      });
    }

    // Process orders and group by month
    orders.forEach((order) => {
      const orderDate = new Date(order.order_date);
      const orderMonthKey = orderDate.toISOString().slice(0, 7);

      // Find the corresponding month in our data
      const monthData = months.find((m) => m.monthKey === orderMonthKey);

      if (monthData) {
        monthData.ordered += 1;

        // Count as delivered if paid (assuming paid = delivered for now)
        if (order.is_paid) {
          monthData.delivered += 1;
        }

        // Calculate revenue from order items
        if (order.items && order.items.length > 0) {
          const orderRevenue = order.items.reduce((sum, item) => {
            return sum + parseFloat(item.price_at_purchase) * item.quantity;
          }, 0);
          monthData.revenue += orderRevenue;
        }
      }
    });

    return months;
  },
};
