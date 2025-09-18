import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Eye,
  TrendingDown,
} from "lucide-react";
import { analyticsService } from "../../services/analyticsService";

const SalesTrendsChart = () => {
  const [chartsData, setChartsData] = useState({
    trendsData: [],
    categories: [],
    categoryPerformance: [],
    loading: true,
  });

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0], // Last 30 days
    endDate: new Date().toISOString().split("T")[0], // Today
    groupBy: "day", // day, week, month
    chartType: "line", // line, bar
  });

  const [selectedCategories, setSelectedCategories] = useState(new Set());

  // Colors for different categories
  const categoryColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ];

  useEffect(() => {
    loadChartsData();
  }, [filters.startDate, filters.endDate, filters.groupBy]);

  const loadChartsData = async () => {
    try {
      setChartsData((prev) => ({ ...prev, loading: true }));

      // Load sales trends and category performance
      const [trendsResult, categoryPerformance] = await Promise.all([
        analyticsService.getSalesTrendsFromOrders({
          startDate: filters.startDate,
          endDate: filters.endDate,
          groupBy: filters.groupBy,
        }),
        analyticsService.getCategoryPerformance({
          startDate: filters.startDate,
          endDate: filters.endDate,
        }),
      ]);

      const { data, categories } = trendsResult.trends;

      // Initialize selected categories with all categories if none selected
      if (selectedCategories.size === 0) {
        setSelectedCategories(new Set(categories.slice(0, 5))); // Show top 5 by default
      }

      setChartsData({
        trendsData: data,
        categories,
        categoryPerformance,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load charts data:", error);
      setChartsData({
        trendsData: [],
        categories: [],
        categoryPerformance: [],
        loading: false,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    switch (filters.groupBy) {
      case "week":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "month":
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      default:
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
    }
  };

  const toggleCategory = (category) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`Date: ${formatDate(
            label
          )}`}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {`${item.dataKey}: ${formatCurrency(item.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartsData.loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Trends by Category
            </h2>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, chartType: "line" }))
              }
              className={`p-2 rounded-md ${
                filters.chartType === "line"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, chartType: "bar" }))
              }
              className={`p-2 rounded-md ${
                filters.chartType === "bar"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-3 py-2 border text-blue-600 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full px-3 py-2 text-blue-600 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              value={filters.groupBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, groupBy: e.target.value }))
              }
              className="w-full px-3 py-2 text-blue-600 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories Shown
            </label>
            <p className="text-sm text-gray-500">
              {selectedCategories.size} of {chartsData.categories.length}{" "}
              selected
            </p>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">
            Select Categories to Display
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {chartsData.categories.map((category, index) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.has(category)
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{
                backgroundColor: selectedCategories.has(category)
                  ? categoryColors[index % categoryColors.length]
                  : undefined,
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="mb-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {filters.chartType === "line" ? (
              <LineChart data={chartsData.trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}k`}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {Array.from(selectedCategories).map((category, index) => (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={
                      categoryColors[
                        chartsData.categories.indexOf(category) %
                          categoryColors.length
                      ]
                    }
                    strokeWidth={2}
                    dot={{
                      fill: categoryColors[
                        chartsData.categories.indexOf(category) %
                          categoryColors.length
                      ],
                      strokeWidth: 2,
                      r: 4,
                    }}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart data={chartsData.trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}k`}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {Array.from(selectedCategories).map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    fill={
                      categoryColors[
                        chartsData.categories.indexOf(category) %
                          categoryColors.length
                      ]
                    }
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance Summary */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-4 w-4 text-gray-600" />
          <h3 className="text-md font-medium text-gray-900">
            Category Performance Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance List */}
          <div className="space-y-3">
            {chartsData.categoryPerformance
              .slice(0, 6)
              .map((category, index) => (
                <div
                  key={category.category}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            categoryColors[index % categoryColors.length],
                        }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {category.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.totalQuantity} items •{" "}
                          {category.totalOrders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">
                        {formatCurrency(category.totalSales)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.salesPercentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pie Chart */}
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartsData.categoryPerformance.slice(0, 6)}
                  dataKey="totalSales"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, salesPercentage }) =>
                    `${category}: ${salesPercentage.toFixed(0)}%`
                  }
                  labelLine={false}
                  fontSize={12}
                >
                  {chartsData.categoryPerformance
                    .slice(0, 6)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[index % categoryColors.length]}
                      />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Sales"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendsChart;
