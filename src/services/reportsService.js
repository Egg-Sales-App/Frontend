import { apiService } from "./api";

export const reportsService = {
  // Get dashboard summary
  async getDashboardSummary() {
    try {
      // Aggregate data from multiple endpoints
      const [products, orders, users] = await Promise.all([
        apiService.get("/products/"),
        apiService.get("/orders/"),
        apiService.get("/users/"),
      ]);

      const totalProducts = products.count || 0;
      const lowStockProducts = (products.results || []).filter(
        (product) => product.quantity_in_stock < 10
      ).length;

      const totalOrders = orders.count || 0;
      const totalRevenue = (orders.results || []).reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );

      const totalUsers = users.count || 0;

      return {
        totalProducts,
        lowStockProducts,
        totalOrders,
        totalRevenue,
        totalUsers,
        recentOrders: orders.results?.slice(0, 5) || [],
      };
    } catch (error) {
      throw new Error("Failed to fetch dashboard summary");
    }
  },

  // Generate sales report
  async generateSalesReport(params = {}) {
    try {
      const response = await apiService.get("/orders/", {
        page_size: 1000, // Get all orders for reporting
        ordering: "-order_date",
      });

      const orders = response.results || [];

      // Process the data for reporting
      const salesData = orders.map((order) => ({
        id: order.id,
        ref_code: order.ref_code,
        date: order.order_date,
        total: order.total_amount,
        isPaid: order.is_paid,
        customer: order.customer,
        guestName: order.guest_name,
      }));

      return {
        sales: salesData,
        summary: {
          totalSales: orders.length,
          totalRevenue: orders.reduce(
            (sum, order) => sum + parseFloat(order.total_amount || 0),
            0
          ),
          paidOrders: orders.filter((order) => order.is_paid).length,
        },
      };
    } catch (error) {
      throw new Error("Failed to generate sales report");
    }
  },

  // Generate inventory report
  async generateInventoryReport(params = {}) {
    try {
      const response = await apiService.get("/products/", {
        page_size: 1000,
        category: params.category,
        ordering: "name",
      });

      const products = response.results || [];

      const inventoryData = products.map((product) => ({
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        quantity: product.quantity_in_stock,
        price: product.price,
        unit: product.unit,
        expiryDate: product.expiry_date,
        isLowStock: product.quantity_in_stock < 10,
      }));

      return {
        inventory: inventoryData,
        summary: {
          totalProducts: products.length,
          lowStockItems: products.filter((p) => p.quantity_in_stock < 10)
            .length,
          totalValue: products.reduce(
            (sum, p) => sum + p.quantity_in_stock * parseFloat(p.price || 0),
            0
          ),
        },
      };
    } catch (error) {
      throw new Error("Failed to generate inventory report");
    }
  },

  // Generate financial report (simplified)
  async generateFinancialReport(params = {}) {
    try {
      const [orders, payments] = await Promise.all([
        apiService.get("/orders/", { page_size: 1000 }),
        apiService.get("/payments/", { page_size: 1000 }),
      ]);

      const orderData = orders.results || [];
      const paymentData = payments.results || [];

      const totalRevenue = orderData.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );
      const totalPayments = paymentData.reduce(
        (sum, payment) => sum + parseFloat(payment.amount || 0),
        0
      );

      return {
        revenue: totalRevenue,
        payments: totalPayments,
        outstanding: totalRevenue - totalPayments,
        orderCount: orderData.length,
        paymentCount: paymentData.length,
      };
    } catch (error) {
      throw new Error("Failed to generate financial report");
    }
  },
};
