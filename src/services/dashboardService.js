import { apiService } from "./api";

export const dashboardService = {
  // Get dashboard summary from the dedicated dashboard endpoint
  async getDashboardSummary() {
    try {
      const response = await apiService.get("/dashboard/");
      return response;
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
      throw new Error("Failed to fetch dashboard summary");
    }
  },

  // Get sales analytics data
  async getSalesAnalytics(timeRange = "month") {
    try {
      // This would be a dedicated analytics endpoint in the future
      const orders = await apiService.get("/orders/", {
        page_size: 100,
        ordering: "-order_date",
      });

      return {
        totalSales:
          orders.results?.reduce(
            (sum, order) => sum + parseFloat(order.total_amount || 0),
            0
          ) || 0,
        orders: orders.results || [],
        count: orders.count || 0,
      };
    } catch (error) {
      console.error("Failed to fetch sales analytics:", error);
      return { totalSales: 0, orders: [], count: 0 };
    }
  },

  // Get inventory analytics
  async getInventoryAnalytics() {
    try {
      const products = await apiService.get("/products/", {
        page_size: 1000,
      });

      const totalValue = (products.results || []).reduce(
        (sum, product) =>
          sum +
          parseFloat(product.price || 0) *
            parseInt(product.quantity_in_stock || 0),
        0
      );

      return {
        totalProducts: products.count || 0,
        totalValue,
        products: products.results || [],
      };
    } catch (error) {
      console.error("Failed to fetch inventory analytics:", error);
      return { totalProducts: 0, totalValue: 0, products: [] };
    }
  },

  // Get customer analytics
  async getCustomerAnalytics() {
    try {
      const customers = await apiService.get("/customers/", {
        page_size: 100,
      });

      return {
        totalCustomers: customers.count || 0,
        customers: customers.results || [],
      };
    } catch (error) {
      console.error("Failed to fetch customer analytics:", error);
      return { totalCustomers: 0, customers: [] };
    }
  },

  // Get employee analytics (if available)
  async getEmployeeAnalytics() {
    try {
      const users = await apiService.get("/users/", {
        page_size: 100,
      });

      return {
        totalEmployees: users.count || 0,
        employees: users.results || [],
      };
    } catch (error) {
      console.error("Failed to fetch employee analytics:", error);
      return { totalEmployees: 0, employees: [] };
    }
  },
};
