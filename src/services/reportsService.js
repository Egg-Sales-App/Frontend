import { apiService } from "./api";

export const reportsService = {
  // Get dashboard summary
  async getDashboardSummary() {
    try {
      const response = await apiService.get("/reports/dashboard");
      return response.data || response;
    } catch (error) {
      throw new Error("Failed to fetch dashboard summary");
    }
  },

  // Generate sales report
  async generateSalesReport(params = {}) {
    try {
      const response = await apiService.get("/reports/sales", {
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        format: params.format || "json", // 'json', 'pdf', 'excel'
        groupBy: params.groupBy || "day",
      });

      return response.data || response;
    } catch (error) {
      throw new Error("Failed to generate sales report");
    }
  },

  // Generate inventory report
  async generateInventoryReport(params = {}) {
    try {
      const response = await apiService.get("/reports/inventory", {
        category: params.category,
        lowStock: params.lowStock,
        format: params.format || "json",
      });

      return response.data || response;
    } catch (error) {
      throw new Error("Failed to generate inventory report");
    }
  },

  // Generate financial report
  async generateFinancialReport(params = {}) {
    try {
      const response = await apiService.get("/reports/financial", {
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        format: params.format || "json",
      });

      return response.data || response;
    } catch (error) {
      throw new Error("Failed to generate financial report");
    }
  },
};
