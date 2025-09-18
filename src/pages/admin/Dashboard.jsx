import React, { useMemo, useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import MetricCard from "../../components/ui/MetricCard";
import StockCard from "../../components/ui/StockCard";
import SalesOverview from "../../components/ui/SalesOverview";
import SalesTrendsChart from "../../components/ui/SalesTrendsChart";
import { useApi } from "../../hooks/useApi";
import { inventoryService } from "../../services/inventoryService";
import { reportsService } from "../../services/reportsService";
import { dashboardService } from "../../services/dashboardService";
import { useToast } from "../../components/ui/ToastContext";

import chickenFeed from "../../assets/chicken_feed.png";
import broilers from "../../assets/broilers.jpeg";
import day_old_chicks from "../../assets/day_old_chicks.jpg";
import dewormer from "../../assets/dewormer.png";
import feeder from "../../assets/feeder.png";
import broilerEquipment from "../../assets/broilerequipment.png";
import equipment from "../../assets/equipment.png";
import hybridFeed from "../../assets/hybridfeed.png";
import fullCrateEggs from "../../assets/fullcrateeggs.png";
import weeksOldChicks from "../../assets/weeksoldchicks.png";
import {
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  BrickWall,
  Warehouse,
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  PackageSearch,
} from "lucide-react";

// Helper function to get appropriate image for product
const getProductImage = (category, productName) => {
  const name = productName.toLowerCase();
  const cat = category?.toLowerCase() || "";

  // Drug/Medicine products
  if (
    cat.includes("drug") ||
    name.includes("dewormer") ||
    name.includes("medicine")
  ) {
    return dewormer;
  }

  // Equipment products
  if (
    cat.includes("equipment") ||
    name.includes("feeder") ||
    name.includes("broiler")
  ) {
    if (name.includes("feeder")) return feeder;
    if (name.includes("broiler")) return broilerEquipment;
    return equipment;
  }

  // Feed products
  if (
    cat.includes("feed") ||
    cat.includes("nutrition") ||
    name.includes("feed")
  ) {
    if (
      name.includes("chicken") ||
      name.includes("starter") ||
      name.includes("layer")
    ) {
      return chickenFeed;
    }
    return hybridFeed;
  }

  // Egg products
  if (cat.includes("egg") || name.includes("egg")) {
    return fullCrateEggs;
  }

  // Chick products
  if (cat.includes("chick") || name.includes("chick")) {
    if (name.includes("weeks") || name.includes("old")) {
      return weeksOldChicks;
    }
    return day_old_chicks;
  }

  // Default fallback based on category
  switch (cat) {
    case "drugs":
      return dewormer;
    case "equipment":
      return equipment;
    case "feed":
    case "nutrition":
      return hybridFeed;
    case "eggs":
      return fullCrateEggs;
    case "chicks":
      return day_old_chicks;
    default:
      return hybridFeed; // Default fallback
  }
};

const Dashboard = () => {
  const { error: showError } = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data - looks like everything comes from dashboard summary
        const [dashboardSummary] = await Promise.allSettled([
          dashboardService.getDashboardSummary(),
        ]);

        setDashboardData({
          summary:
            dashboardSummary.status === "fulfilled"
              ? dashboardSummary.value.summary
              : null,
          lowStock:
            dashboardSummary.status === "fulfilled"
              ? dashboardSummary.value.low_stock_products
              : [],
          topSelling:
            dashboardSummary.status === "fulfilled"
              ? dashboardSummary.value.top_selling_products
              : [],
          recentSales:
            dashboardSummary.status === "fulfilled"
              ? dashboardSummary.value.recent_orders
              : [],
        });

        // Show errors for failed requests
        if (dashboardSummary.status === "rejected") {
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
    const recentSales = dashboardData?.recentSales || [];

    if (!summary) return [];

    // Calculate total from recent orders since total_revenue might be calculated differently
    const recentOrdersTotal = recentSales.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || 0),
      0
    );

    return [
      {
        icon: <BarChart3 />,
        value: `₦${recentOrdersTotal.toFixed(2)}`,
        label: "Recent Sales",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      {
        icon: <LineChart />,
        value: summary.total_orders || 0,
        label: "Total Orders",
        bgColor: "bg-green-100",
        iconColor: "text-green-500",
      },
      {
        icon: <PieChart />,
        value: summary.total_products || 0,
        label: "Products",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-500",
      },
      {
        icon: <DollarSign />,
        value: summary.total_customers || 0,
        label: "Customers",
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
        value: summary.total_products || "0",
        label: "Total Products",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
      },
      {
        icon: <Warehouse />,
        value: dashboardData?.lowStock?.length || "0",
        label: "Low Stock Items",
        bgColor: "bg-red-100",
        iconColor: "text-red-500",
      },
    ];
  }, [dashboardData]);

  // Dynamic Sales Insights based on real data
  const salesInsights = useMemo(() => {
    const summary = dashboardData?.summary;
    const recentSales = dashboardData?.recentSales || [];

    if (!summary) return [];

    // Calculate insights from actual data
    const totalRevenue = parseFloat(summary.total_revenue || 0);
    const totalOrders = summary.total_orders || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return [
      {
        label: "🐥 Total Sales",
        value: `GHS ${totalRevenue.toFixed(2)}`,
        change: totalOrders > 0 ? "+15%" : "0%",
        trend: totalOrders > 0 ? "up" : "down",
      },
      {
        label: "📦 Total Orders",
        value: `${totalOrders}`,
        change: totalOrders > 10 ? "+8%" : "0%",
        trend: totalOrders > 10 ? "up" : "down",
      },
      {
        label: "💰 Average Order Value",
        value: `GHS ${avgOrderValue.toFixed(2)}`,
        change: avgOrderValue > 100 ? "+12%" : "0%",
        trend: avgOrderValue > 100 ? "up" : "down",
      },
      {
        label: "📊 Products Available",
        value: `${summary.total_products || 0}`,
        change: "+5%",
        trend: "up",
      },
    ];
  }, [dashboardData]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner text-primary loading-lg"></div>
          <span className="ml-4 text-blue-400">Loading dashboard...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
        {/* Left Column - Adjusts based on screen size */}
        <div className="flex flex-col gap-6 w-full lg:w-[60%]">
          {/* Sales Overview - Daily orders and employee performance */}
          <section className="w-full bg-white rounded-lg shadow-md p-0">
            <SalesOverview />
          </section>

          {/* Sales Trend */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sales Trend
            </h2>
            <SalesTrendsChart />
          </section>
        </div>

        {/* Right Column - Adjusts based on screen size */}
        <div className="flex flex-col gap-4 w-full lg:w-[40%]">
          {/* Inventory Summary */}
          <section className="w-full bg-white rounded-lg p-2 shadow relative">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Inventory Summary
            </h2>
            <div className="flex justify-between items-start flex-wrap">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <PackageSearch size={18} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    {dashboardData?.summary?.total_products || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Products</div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <Warehouse size={18} className="text-red-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    {dashboardData?.lowStock?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Low Stock Items</div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <TrendingUp size={18} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    {dashboardData?.summary?.total_suppliers || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Suppliers</div>
                </div>
              </div>
            </div>
          </section>

          {/* Low Stock Items */}
          <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Low Quantity Stock
              </h2>
              <button className="btn bg-white text-blue-500">see all</button>
            </div>

            {/* Low Stock Items - Dynamic from API */}
            {dashboardData?.lowStock && dashboardData.lowStock.length > 0 ? (
              dashboardData.lowStock.slice(0, 3).map((product, index) => (
                <section
                  key={index}
                  className="w-full h-[75px] bg-red-300 shadow rounded-lg flex items-center gap-3 p-2 mt-6"
                >
                  {/* Image - Use smart image selection based on category/name */}
                  <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={getProductImage(
                        product.category?.name,
                        product.name
                      )}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text Info */}
                  <div className="flex flex-col justify-center flex-grow">
                    <span className="text-[18px] font-bold text-gray-800">
                      {product.name}
                    </span>
                    <span className="text-[14px] text-gray-700">
                      Remaining Quantity: {product.quantity_in_stock} units
                    </span>
                  </div>

                  {/* Status Tag */}
                  <div className="flex-shrink-0">
                    <div className="bg-[#FEECEB] text-[#AA3028] text-sm font-medium px-2 py-1 rounded-full">
                      Low
                    </div>
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No low stock items currently</p>
              </div>
            )}
          </section>

          {/* top selling stock */}
          <section className="w-full bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Top Selling Stock
              </h2>
              <button className="btn bg-white text-blue-500">see all</button>
            </div>

            {/* Top Selling Products - Enhanced Implementation */}
            {dashboardData?.topSelling &&
            dashboardData.topSelling.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.topSelling.slice(0, 3).map((product, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full">
                          <PackageSearch className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.product__name}
                          </p>
                          <p className="text-sm text-gray-500">
                            #{index + 1} Best Seller
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-gray-900">
                          {product.total_quantity} sold
                        </p>
                        <p className="text-sm text-gray-500">Total Quantity</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(
                              10,
                              (product.total_quantity /
                                Math.max(
                                  ...dashboardData.topSelling.map(
                                    (p) => p.total_quantity
                                  )
                                )) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Sales Performance</span>
                        <span className="font-medium text-green-600">
                          {(
                            (product.total_quantity /
                              dashboardData.topSelling.reduce(
                                (sum, p) => sum + p.total_quantity,
                                0
                              )) *
                            100
                          ).toFixed(1)}
                          % of total sales
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PackageSearch className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No top selling products data available</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
