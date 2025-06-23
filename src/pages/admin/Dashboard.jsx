import React, { useMemo, useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import MetricCard from "../../components/ui/MetricCard";
import StockCard from "../../components/ui/StockCard";
import SalesSummary from "../../components/SalesSummary";
import { useApi } from "../../hooks/useApi";
import { inventoryService } from "../../services/inventoryService";
import { salesService } from "../../services/salesService";
import { reportsService } from "../../services/reportsService";
import { useToast } from "../../components/ui/ToastContext";
import {
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  CreditCard,
  SquareX,
  HandCoins,
  BrickWall,
  Warehouse,
  Users,
  ClipboardList,
} from "lucide-react";

const Dashboard = () => {
  const { error: showError } = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data in parallel
        const [summary, lowStock, topSelling, salesChart] =
          await Promise.allSettled([
            reportsService.getDashboardSummary(),
            inventoryService.getLowStockItems(),
            inventoryService.getTopSellingProducts(5),
            salesService.getSalesChartData("30d"),
          ]);

        setDashboardData({
          summary: summary.status === "fulfilled" ? summary.value : null,
          lowStock: lowStock.status === "fulfilled" ? lowStock.value : [],
          topSelling: topSelling.status === "fulfilled" ? topSelling.value : [],
          salesChart: salesChart.status === "fulfilled" ? salesChart.value : [],
        });

        // Show errors for failed requests
        if (summary.status === "rejected") {
          showError("Failed to load dashboard summary");
        }
      } catch (error) {
        showError("Failed to load dashboard data");
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showError]);

  // Sales metrics with real data
  const salesMetrics = useMemo(() => {
    const summary = dashboardData?.summary;
    if (!summary) return [];

    return [
      {
        icon: <BarChart3 />,
        value: `GHS ${summary.sales?.total || 0}`,
        label: "Total Sales",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      {
        icon: <LineChart />,
        value: `GHS ${summary.revenue?.total || 0}`,
        label: "Revenue",
        bgColor: "bg-green-100",
        iconColor: "text-green-500",
      },
      {
        icon: <PieChart />,
        value: `GHS ${summary.profit?.total || 0}`,
        label: "Profit",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-500",
      },
      {
        icon: <DollarSign />,
        value: `GHS ${summary.expenses?.total || 0}`,
        label: "Expenses",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
      },
    ];
  }, [dashboardData]);

  // Inventory metrics
  const inventoryMetrics = useMemo(() => {
    const summary = dashboardData?.summary;
    if (!summary) return [];

    return [
      {
        icon: <BrickWall />,
        value: summary.inventory?.totalItems || "0",
        label: "Total Products",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
      },
      {
        icon: <Warehouse />,
        value: summary.inventory?.lowStockCount || "0",
        label: "Low Stock Items",
        bgColor: "bg-red-100",
        iconColor: "text-red-500",
      },
    ];
  }, [dashboardData]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-4">Loading dashboard...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex gap-6 min-h-screen">
        {/* Left Column */}
        <div className="flex flex-col gap-6 w-[60%]">
          {/* Sales Overview */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sales Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {salesMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </section>

          {/* Sales Chart */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sales Trend
            </h2>
            {dashboardData?.salesChart ? (
              <SalesSummary data={dashboardData.salesChart} />
            ) : (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </section>

          {/* Top Selling Products */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Top Selling Products
              </h2>
              <button className="btn btn-sm btn-outline">See all</button>
            </div>

            {dashboardData?.topSelling?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-gray-600">
                        Product
                      </th>
                      <th className="text-left py-2 font-medium text-gray-600">
                        Sold
                      </th>
                      <th className="text-left py-2 font-medium text-gray-600">
                        Stock
                      </th>
                      <th className="text-left py-2 font-medium text-gray-600">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topSelling.map((product, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">{product.name}</td>
                        <td className="py-3">{product.soldQuantity}</td>
                        <td className="py-3">{product.currentStock}</td>
                        <td className="py-3">GHS {product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No sales data available
              </p>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 w-[40%]">
          {/* Inventory Summary */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Inventory Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {inventoryMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </section>

          {/* Low Stock Items */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Low Stock Alert
              </h2>
              <button className="btn btn-sm btn-outline">See all</button>
            </div>

            {dashboardData?.lowStock?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.lowStock.slice(0, 5).map((item, index) => (
                  <StockCard
                    key={index}
                    name={item.name}
                    image={item.image || "/assets/default-product.png"}
                    remainingQuantity={`${item.quantity} ${
                      item.unit || "units"
                    }`}
                    status="Low"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                All products are well stocked!
              </p>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
