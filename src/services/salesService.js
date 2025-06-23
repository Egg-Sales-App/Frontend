import { apiService } from "./api";

export const salesService = {
  // Get all sales/orders
  async getSales(params = {}) {
    try {
      const response = await apiService.get("/sales", {
        page: params.page || 1,
        limit: params.limit || 20,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        status: params.status,
        customer: params.customer,
      });

      return {
        sales: response.data || response.sales || [],
        pagination: response.pagination || {},
        total: response.total || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch sales");
    }
  },

  // Create new sale
  async createSale(saleData) {
    try {
      const response = await apiService.post("/sales", {
        customerId: saleData.customerId,
        items: saleData.items, // [{ productId, quantity, price }]
        discount: parseFloat(saleData.discount || 0),
        tax: parseFloat(saleData.tax || 0),
        paymentMethod: saleData.paymentMethod,
        notes: saleData.notes,
      });

      return {
        success: true,
        sale: response.data || response.sale || response,
        message: response.message || "Sale created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create sale");
    }
  },

  // Get sales statistics
  async getSalesStats(period = "30d") {
    try {
      const response = await apiService.get("/sales/stats", { period });
      return response.data || response;
    } catch (error) {
      throw new Error("Failed to fetch sales statistics");
    }
  },

  // Get sales chart data
  async getSalesChartData(period = "30d", groupBy = "day") {
    try {
      const response = await apiService.get("/sales/chart", {
        period,
        groupBy,
      });
      return response.data || response.chartData || [];
    } catch (error) {
      throw new Error("Failed to fetch sales chart data");
    }
  },
};
