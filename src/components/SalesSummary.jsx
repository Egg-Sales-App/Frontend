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
} from "recharts";
// Service layer for fetching sales data from the backend
import { salesService } from "../services/salesService";
// Toast hook for showing error notifications
import { useToast } from "./ui/ToastContext";
// UI components for handling empty states and loading
import EmptyState from "./ui/EmptyState";
import LoadingSpinner from "./ui/LoadingSpinner";

const SalesSummary = () => {
  // State for holding chart data
  const [salesData, setSalesData] = useState([]);
  // Loading state for showing spinner while fetching
  const [loading, setLoading] = useState(true);
  // Access toast error function (renamed as showError for clarity)
  const { error: showError } = useToast();

  // Fetch sales summary data when the component mounts
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        // Request 12 months of sales data from backend service
        const response = await salesService.getSalesChartData("12m");

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
  }, [showError]); // Re-run if toast context changes

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

  // Render sales line chart once data is available
  return (
    <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Sales Summary
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={salesData}>
          {/* Grid lines for better readability */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* X-axis shows months */}
          <XAxis dataKey="month" />
          {/* Y-axis auto-scales based on values */}
          <YAxis />
          {/* Hover tooltip */}
          <Tooltip />
          {/* Legend for distinguishing chart lines */}
          <Legend />
          {/* Line for orders */}
          <Line
            type="monotone"
            dataKey="ordered"
            stroke="#8884d8"
            name="Orders"
            strokeWidth={2}
          />
          {/* Line for deliveries */}
          <Line
            type="monotone"
            dataKey="delivered"
            stroke="#82ca9d"
            name="Delivered"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default SalesSummary;
