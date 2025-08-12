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
} from "recharts";
import { salesService } from "../services/salesService";
import { useToast } from "./ui/ToastContext";
import EmptyState from "./ui/EmptyState";
import LoadingSpinner from "./ui/LoadingSpinner";

const SalesSummary = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        // Try to get monthly sales data from the backend
        const response = await salesService.getSalesChartData("12m");

        if (response && Array.isArray(response)) {
          setSalesData(response);
        } else {
          // If no data available, show message
          setSalesData([]);
        }
      } catch (error) {
        console.error("Failed to fetch sales summary data:", error);
        showError?.("Failed to load sales summary data");
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [showError]);

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

  return (
    <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Sales Summary
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ordered"
            stroke="#8884d8"
            name="Orders"
            strokeWidth={2}
          />
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
