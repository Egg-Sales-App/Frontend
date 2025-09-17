import React, { useState, useEffect } from "react";
// Recharts components for drawing the line chart
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
} from "recharts";
// Service layer for fetching sales data from the backend
import { salesService } from "../services/salesService";
// Toast hook for showing error notifications
import { useToast } from "./ui/ToastContext";
// UI components for handling empty states and loading
import EmptyState from "./ui/EmptyState";
import LoadingSpinner from "./ui/LoadingSpinner";
import { Calendar, BarChart3, LineChart as LineChartIcon, TrendingUp } from "lucide-react";

const SalesSummary = () => {
  // State for holding chart data
  const [salesData, setSalesData] = useState([]);
  // Loading state for showing spinner while fetching
  const [loading, setLoading] = useState(true);
  // Chart type toggle state
  const [chartType, setChartType] = useState("line"); // "line" or "bar"
  // Time period selector state
  const [selectedPeriod, setSelectedPeriod] = useState("12m");
  // Access toast error function (renamed as showError for clarity)
  const { error: showError } = useToast();

  // Available time periods
  const periods = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "12m", label: "12 Months" },
  ];

  // Fetch sales summary data when the component mounts or period changes
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        // Request sales data for selected period from backend service
        const response = await salesService.getSalesChartData(selectedPeriod);

        // Ensure the response is valid and in array format
        if (response && Array.isArray(response)) {
          setSalesData(response);
        } else {
          // If response is invalid or empty, reset data
          setSalesData([]);
        }
      } catch (error) {
        // Handle errors gracefully
        console.error("Failed to fetch sales summary data:", error);
        showError?.("Failed to load sales summary data"); // Optional chaining in case toast is unavailable
        setSalesData([]);
      } finally {
        // Stop loading in both success and error cases
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedPeriod]); // Fetch data when period changes

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Sales Summary
        </h2>
        <LoadingSpinner
          size="lg"
          message="Loading sales data..."
          className="h-64"
        />
      </section>
    );
  }

  // Show empty state if no sales data is available
  if (!salesData || salesData.length === 0) {
    return (
      <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Sales Summary
        </h2>
        <EmptyState type="SALES_OVERVIEW" className="h-64" />
      </section>
    );
  }

  // Calculate summary statistics
  const totalOrders = salesData.reduce((sum, month) => sum + (month.ordered || 0), 0);
  const totalDelivered = salesData.reduce((sum, month) => sum + (month.delivered || 0), 0);
  const totalRevenue = salesData.reduce((sum, month) => sum + (month.revenue || 0), 0);

  // Custom tooltip for displaying formatted data
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === "revenue" && entry.value > 0
                ? ` (GHS ${entry.value.toFixed(2)})`
                : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render sales chart once data is available
  return (
    <section className="w-full h-[450px] bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Sales Summary</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Period Selector */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Chart Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("line")}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                chartType === "line"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <LineChartIcon size={16} />
              Line
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                chartType === "bar"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <BarChart3 size={16} />
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Total Orders</span>
          </div>
          <span className="text-xl font-bold text-blue-900">{totalOrders}</span>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">Delivered</span>
          </div>
          <span className="text-xl font-bold text-green-900">{totalDelivered}</span>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-purple-700">Revenue</span>
          </div>
          <span className="text-xl font-bold text-purple-900">
            GHS {totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="ordered"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Ordered"
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="delivered"
                stroke="#10b981"
                strokeWidth={2}
                name="Delivered"
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Revenue (GHS)"
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="ordered" fill="#3b82f6" name="Ordered" />
              <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
              <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue (GHS)" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default SalesSummary;
