import { apiService } from "./api";

export const analyticsService = {
  // Get sales trends over time for categories
  async getSalesTrends(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        start_date:
          params.startDate ||
          new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0], // Default: last 30 days
        end_date: params.endDate || new Date().toISOString().split("T")[0], // Default: today
        group_by: params.groupBy || "day", // day, week, month
        category_id: params.categoryId || "", // Optional category filter
      });

      const response = await apiService.get(
        `/analytics/sales-trends/?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching sales trends:", error);
      throw new Error("Failed to fetch sales trends");
    }
  },

  // Get sales data grouped by categories for a specific time period
  async getSalesByCategory(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        start_date:
          params.startDate ||
          new Date(new Date().setDate(new Date().getDate() - 7))
            .toISOString()
            .split("T")[0], // Default: last 7 days
        end_date: params.endDate || new Date().toISOString().split("T")[0], // Default: today
        group_by: params.groupBy || "category", // category, product
      });

      const response = await apiService.get(
        `/analytics/sales-by-category/?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching sales by category:", error);
      throw new Error("Failed to fetch sales by category");
    }
  },

  // Fallback: Get sales trends using existing orders API and process client-side
  async getSalesTrendsFromOrders(params = {}) {
    try {
      const { orderService } = await import("./orderService");

      // Get orders for the specified date range
      const ordersResponse = await orderService.getOrders({
        limit: 1000,
        dateFrom:
          params.startDate ||
          new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
        dateTo: params.endDate || new Date().toISOString().split("T")[0],
      });

      const orders = Array.isArray(ordersResponse)
        ? ordersResponse
        : ordersResponse.results || [];

      // Process orders to create trends data
      const trendsData = this.processOrdersForTrends(
        orders,
        params.groupBy || "day"
      );

      return { trends: trendsData };
    } catch (error) {
      console.error("Error fetching sales trends from orders:", error);
      throw new Error("Failed to fetch sales trends from orders");
    }
  },

  // Helper function to process orders into trends data
  processOrdersForTrends(orders, groupBy = "day") {
    const salesByDateAndCategory = {};
    const categories = new Set();

    // Group orders by date and category
    orders.forEach((order) => {
      const orderDate = new Date(order.order_date);
      let dateKey;

      // Create date key based on groupBy parameter
      switch (groupBy) {
        case "week":
          const weekStart = new Date(orderDate);
          weekStart.setDate(orderDate.getDate() - orderDate.getDay());
          dateKey = weekStart.toISOString().split("T")[0];
          break;
        case "month":
          dateKey = `${orderDate.getFullYear()}-${String(
            orderDate.getMonth() + 1
          ).padStart(2, "0")}`;
          break;
        default: // day
          dateKey = orderDate.toISOString().split("T")[0];
      }

      if (!salesByDateAndCategory[dateKey]) {
        salesByDateAndCategory[dateKey] = {};
      }

      // Process each item in the order
      order.items?.forEach((item) => {
        const categoryName = item.product?.category?.name || "Uncategorized";
        categories.add(categoryName);

        if (!salesByDateAndCategory[dateKey][categoryName]) {
          salesByDateAndCategory[dateKey][categoryName] = {
            totalSales: 0,
            totalQuantity: 0,
            orderCount: 0,
          };
        }

        const itemTotal =
          parseFloat(item.price_at_purchase || 0) *
          parseInt(item.quantity || 0);
        salesByDateAndCategory[dateKey][categoryName].totalSales += itemTotal;
        salesByDateAndCategory[dateKey][categoryName].totalQuantity += parseInt(
          item.quantity || 0
        );
      });

      // Count orders per category per date
      const orderCategories = new Set();
      order.items?.forEach((item) => {
        const categoryName = item.product?.category?.name || "Uncategorized";
        if (!orderCategories.has(categoryName)) {
          orderCategories.add(categoryName);
          salesByDateAndCategory[dateKey][categoryName].orderCount += 1;
        }
      });
    });

    // Convert to array format suitable for charts
    const trendsData = Object.keys(salesByDateAndCategory)
      .sort()
      .map((date) => {
        const dayData = { date, totalSales: 0 };

        categories.forEach((category) => {
          const categoryData = salesByDateAndCategory[date][category] || {
            totalSales: 0,
            totalQuantity: 0,
            orderCount: 0,
          };
          dayData[category] = categoryData.totalSales;
          dayData[`${category}_quantity`] = categoryData.totalQuantity;
          dayData[`${category}_orders`] = categoryData.orderCount;
          dayData.totalSales += categoryData.totalSales;
        });

        return dayData;
      });

    return {
      data: trendsData,
      categories: Array.from(categories),
      dateRange: {
        start: trendsData[0]?.date,
        end: trendsData[trendsData.length - 1]?.date,
      },
    };
  },

  // Get category performance summary
  async getCategoryPerformance(params = {}) {
    try {
      const trendsResult = await this.getSalesTrendsFromOrders(params);
      const { data, categories } = trendsResult.trends;

      // Calculate category performance metrics
      const categoryPerformance = categories.map((category) => {
        const totalSales = data.reduce(
          (sum, day) => sum + (day[category] || 0),
          0
        );
        const totalQuantity = data.reduce(
          (sum, day) => sum + (day[`${category}_quantity`] || 0),
          0
        );
        const totalOrders = data.reduce(
          (sum, day) => sum + (day[`${category}_orders`] || 0),
          0
        );
        const averageDailySales = totalSales / data.length;

        return {
          category,
          totalSales,
          totalQuantity,
          totalOrders,
          averageDailySales,
          salesPercentage: 0, // Will calculate after getting total
        };
      });

      // Calculate percentages
      const grandTotal = categoryPerformance.reduce(
        (sum, cat) => sum + cat.totalSales,
        0
      );
      categoryPerformance.forEach((cat) => {
        cat.salesPercentage =
          grandTotal > 0 ? (cat.totalSales / grandTotal) * 100 : 0;
      });

      return categoryPerformance.sort((a, b) => b.totalSales - a.totalSales);
    } catch (error) {
      console.error("Error calculating category performance:", error);
      throw new Error("Failed to calculate category performance");
    }
  },
};
