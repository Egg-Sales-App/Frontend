import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { useToast } from "../../hooks/useToast";
import LoadingSpinner from "./LoadingSpinner";

const KPISection = () => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchKPIData();
    // Refresh KPIs every 2 minutes
    const interval = setInterval(fetchKPIData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getOperationalKPIs();
      setKpiData(data);
    } catch (error) {
      console.error("Failed to fetch KPI data:", error);
      showToast("Failed to load KPI data", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value) => {
    return `${parseFloat(value || 0).toFixed(1)}%`;
  };

  const KPICard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    trend, 
    status, 
    color = "blue",
    target,
    isPercentage = false 
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
      red: "bg-red-50 border-red-200 text-red-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
    };

    const statusColors = {
      excellent: "text-green-600 bg-green-100",
      good: "text-blue-600 bg-blue-100",
      warning: "text-orange-600 bg-orange-100",
      critical: "text-red-600 bg-red-100",
    };

    return (
      <div className={`p-4 rounded-lg border-2 ${colorClasses[color]} bg-white`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          {status && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {isPercentage ? formatPercentage(value) : value}
            </span>
            {trend && (
              <div className="flex items-center gap-1">
                {trend >= 0 ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  trend >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {trend >= 0 ? "+" : ""}{trend}%
                </span>
              </div>
            )}
          </div>
        </div>
        
        {subtitle && (
          <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
        )}
        
        {target && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Target: {isPercentage ? formatPercentage(target) : target}</span>
            <div className={`w-2 h-2 rounded-full ${
              (isPercentage ? value >= target : parseInt(value) >= target) 
                ? "bg-green-500" 
                : "bg-red-500"
            }`}></div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
        <LoadingSpinner />
      </section>
    );
  }

  if (!kpiData) {
    return (
      <section className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No KPI data available</p>
        </div>
      </section>
    );
  }

  // Calculate status based on performance
  const getOrderFulfillmentStatus = (rate) => {
    if (rate >= 95) return "excellent";
    if (rate >= 85) return "good";
    if (rate >= 70) return "warning";
    return "critical";
  };

  const getStockEfficiencyStatus = (rate) => {
    if (rate >= 90) return "excellent";
    if (rate >= 80) return "good";
    if (rate >= 60) return "warning";
    return "critical";
  };

  return (
    <section className="bg-white rounded-lg p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Key Performance Indicators</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity size={16} />
          <span>Real-time KPIs</span>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<CheckCircle size={20} />}
          title="Order Fulfillment Rate"
          value={kpiData.fulfillmentRate}
          subtitle={`${kpiData.deliveredOrders} of ${kpiData.totalOrders} orders delivered`}
          trend={5.2}
          status={getOrderFulfillmentStatus(kpiData.fulfillmentRate)}
          color="green"
          target={95}
          isPercentage={true}
        />
        
        <KPICard
          icon={<Package size={20} />}
          title="Stock Efficiency"
          value={kpiData.stockEfficiency}
          subtitle={`${kpiData.totalProducts - kpiData.lowStockProducts} products well-stocked`}
          trend={-2.1}
          status={getStockEfficiencyStatus(kpiData.stockEfficiency)}
          color="blue"
          target={85}
          isPercentage={true}
        />
        
        <KPICard
          icon={<Truck size={20} />}
          title="Total Orders"
          value={kpiData.totalOrders}
          subtitle="All-time order count"
          trend={8.7}
          status="good"
          color="purple"
          target="1000"
        />
        
        <KPICard
          icon={<AlertTriangle size={20} />}
          title="Low Stock Items"
          value={kpiData.lowStockProducts}
          subtitle="Items requiring attention"
          trend={kpiData.lowStockProducts > 5 ? 15.3 : -10.2}
          status={kpiData.lowStockProducts > 10 ? "critical" : kpiData.lowStockProducts > 5 ? "warning" : "good"}
          color={kpiData.lowStockProducts > 10 ? "red" : kpiData.lowStockProducts > 5 ? "orange" : "green"}
          target="0"
        />
      </div>

      {/* Operational Metrics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Operational Metrics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Processing */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-blue-500" />
              <h5 className="font-medium text-gray-800">Order Processing</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="font-semibold">{kpiData.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivered</span>
                <span className="font-semibold text-green-600">{kpiData.deliveredOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-orange-600">
                  {kpiData.totalOrders - kpiData.deliveredOrders}
                </span>
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package size={18} className="text-green-500" />
              <h5 className="font-medium text-gray-800">Inventory Status</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Products</span>
                <span className="font-semibold">{kpiData.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Well Stocked</span>
                <span className="font-semibold text-green-600">
                  {kpiData.totalProducts - kpiData.lowStockProducts}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Low Stock</span>
                <span className="font-semibold text-red-600">{kpiData.lowStockProducts}</span>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-purple-500" />
              <h5 className="font-medium text-gray-800">Performance</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fulfillment Rate</span>
                <span className={`font-semibold ${
                  kpiData.fulfillmentRate >= 90 ? "text-green-600" : 
                  kpiData.fulfillmentRate >= 75 ? "text-orange-600" : "text-red-600"
                }`}>
                  {formatPercentage(kpiData.fulfillmentRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stock Efficiency</span>
                <span className={`font-semibold ${
                  kpiData.stockEfficiency >= 85 ? "text-green-600" : 
                  kpiData.stockEfficiency >= 70 ? "text-orange-600" : "text-red-600"
                }`}>
                  {formatPercentage(kpiData.stockEfficiency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overall Health</span>
                <span className={`font-semibold ${
                  (kpiData.fulfillmentRate >= 85 && kpiData.stockEfficiency >= 80) ? "text-green-600" : 
                  (kpiData.fulfillmentRate >= 70 && kpiData.stockEfficiency >= 60) ? "text-orange-600" : "text-red-600"
                }`}>
                  {(kpiData.fulfillmentRate >= 85 && kpiData.stockEfficiency >= 80) ? "Excellent" : 
                   (kpiData.fulfillmentRate >= 70 && kpiData.stockEfficiency >= 60) ? "Good" : "Needs Attention"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KPISection;