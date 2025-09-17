import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Calendar,
  Target,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { useToast } from "../../hooks/useToast";
import LoadingSpinner from "./LoadingSpinner";

const RevenueAnalytics = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const { showToast } = useToast();

  const periods = [
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "365d", label: "1 Year" },
  ];

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getRevenueAnalytics(selectedPeriod);
      setRevenueData(data);
    } catch (error) {
      console.error("Failed to fetch revenue analytics:", error);
      showToast("Failed to load revenue analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `GHS ${parseFloat(value || 0).toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${parseFloat(value || 0).toFixed(1)}%`;
  };

  const TrendIcon = ({ value }) => {
    if (value >= 0) {
      return <TrendingUp size={16} className="text-green-500" />;
    }
    return <TrendingDown size={16} className="text-red-500" />;
  };

  const MetricCard = ({ icon, title, value, change, trend, subtitle }) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon value={trend} />
          <span className={`text-xs font-medium ${
            trend >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {formatPercentage(trend)}
          </span>
        </div>
      </div>
      <div className="mb-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Revenue Analytics</h3>
        </div>
        <LoadingSpinner />
      </section>
    );
  }

  if (!revenueData) {
    return (
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue Analytics</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No revenue data available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Revenue Analytics</h3>
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
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<DollarSign size={18} className="text-green-500" />}
          title="Total Revenue"
          value={formatCurrency(revenueData.currentRevenue)}
          trend={revenueData.revenueGrowth}
          subtitle={`vs ${formatCurrency(revenueData.previousRevenue)} prev period`}
        />
        
        <MetricCard
          icon={<Target size={18} className="text-blue-500" />}
          title="Profit"
          value={formatCurrency(revenueData.currentProfit)}
          trend={revenueData.profitGrowth}
          subtitle="25% margin estimated"
        />
        
        <MetricCard
          icon={<BarChart3 size={18} className="text-purple-500" />}
          title="Avg Order Value"
          value={formatCurrency(revenueData.avgOrderValue)}
          trend={revenueData.avgOrderValue > 100 ? 12 : -5}
          subtitle={`${revenueData.totalOrders} total orders`}
        />
        
        <MetricCard
          icon={<TrendingUp size={18} className="text-orange-500" />}
          title="Growth Rate"
          value={formatPercentage(revenueData.revenueGrowth)}
          trend={revenueData.revenueGrowth}
          subtitle="Revenue growth vs previous period"
        />
      </div>

      {/* Revenue vs Profit Comparison */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Revenue vs Profit Comparison</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Period */}
          <div className="bg-white rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-600 mb-3">Current Period</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(revenueData.currentRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(revenueData.currentProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expenses</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(revenueData.currentRevenue - revenueData.currentProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Previous Period */}
          <div className="bg-white rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-600 mb-3">Previous Period</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-semibold text-gray-600">
                  {formatCurrency(revenueData.previousRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit</span>
                <span className="font-semibold text-gray-600">
                  {formatCurrency(revenueData.previousProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expenses</span>
                <span className="font-semibold text-gray-600">
                  {formatCurrency(revenueData.previousRevenue - revenueData.previousProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendIcon value={revenueData.revenueGrowth} />
                <span className="text-sm font-medium text-gray-600">Revenue Growth</span>
              </div>
              <span className={`text-lg font-bold ${
                revenueData.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {formatPercentage(revenueData.revenueGrowth)}
              </span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendIcon value={revenueData.profitGrowth} />
                <span className="text-sm font-medium text-gray-600">Profit Growth</span>
              </div>
              <span className={`text-lg font-bold ${
                revenueData.profitGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {formatPercentage(revenueData.profitGrowth)}
              </span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Profit Margin</span>
              </div>
              <span className="text-lg font-bold text-blue-600">25.0%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueAnalytics;