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

import chickenFeed from "../../assets/chicken_feed.png";
import broilers from "../../assets/broilers.jpeg";
import day_old_chicks from "../../assets/day_old_chicks.jpg";
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
          {/* Sales Overview section */}
          <section className="w-full bg-white rounded-lg p-4 shadow relative">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Sales Overview
            </h2>
            <div className="flex justify-between items-start flex-wrap">
              <div className="flex items-center gap-3 w-[116px]">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <BarChart3 size={18} className="text-secondary" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 832
                  </div>
                  <div className="text-sm text-gray-500">Sales</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-[163px]">
                <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                  <LineChart size={18} className="text-indigo-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 1,300
                  </div>
                  <div className="text-sm text-gray-500">Revenue</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-[117px]">
                <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <PieChart size={18} className="text-orange-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 868
                  </div>
                  <div className="text-sm text-gray-500">Profit</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-[131px]">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <DollarSign size={18} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 1,432
                  </div>
                  <div className="text-sm text-gray-500">Cost</div>
                </div>
              </div>
            </div>
          </section>

          {/* Purchase Overview section */}
          <section className="w-full h-[120px] bg-white rounded-lg p-4 shadow relative">
            <h2 className="text-[20px] font-medium text-gray-800 mb-4">
              Purchase Overview
            </h2>
            <div className="flex justify-between items-start flex-wrap">
              <div className="flex items-center gap-3 w-[116px]">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <CreditCard size={18} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 832
                  </div>
                  <div className="text-sm text-gray-500">Purchase</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-[163px]">
                <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                  <DollarSign size={18} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 1,300
                  </div>
                  <div className="text-sm text-gray-500">Cost</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-[117px]">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <SquareX size={18} className="text-orange-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 868
                  </div>
                  <div className="text-sm text-gray-500">Cancel</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-[131px]">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <HandCoins size={18} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    GHS 1,432
                  </div>
                  <div className="text-sm text-gray-500">Return</div>
                </div>
              </div>
            </div>
          </section>

          {/* Sales & Purchase Chart section */}
          <section className="relative w-full h-[360px] bg-white rounded-[10px] shadow-md p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-[20px] text-gray-800 font-medium">
                Sales & Purchase
              </h2>
              <div className="flex gap-2">
                <button className="btn bg-green-300 px-4 py-1 rounded shadow-sm text-sm text-gray-600">
                  Weekly
                </button>
                <button className="btn bg-green-300 px-4 py-1 rounded shadow-sm text-sm text-gray-600">
                  Daily
                </button>
              </div>
            </div>

            {/* Y-axis Labels */}
            <div className="absolute left-4 top-[74px] flex flex-col justify-between h-[218px] text-xs text-gray-500">
              {["60,000", "50,000", "40,000", "30,000", "20,000", "10,000"].map(
                (val, idx) => (
                  <span key={idx}>{val}</span>
                )
              )}
            </div>

            {/* Chart Grid */}
            <div className="absolute top-[82px] left-[101px]">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[460px] h-[41px] border-b border-gray-300"
                ></div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute top-[89px] left-[120px] flex gap-4 items-end">
              {[
                { purchase: 186, sales: 163 },
                { purchase: 198, sales: 157 },
                { purchase: 144, sales: 177 },
                { purchase: 112, sales: 139 },
                { purchase: 139, sales: 151 },
                { purchase: 78, sales: 130 },
                { purchase: 186, sales: 163 },
                { purchase: 144, sales: 134 },
                { purchase: 144, sales: 139 },
                { purchase: 112, sales: 139 },
              ].map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="flex gap-1 items-end">
                    <div
                      className="w-2.5 rounded-b-[40px]"
                      style={{
                        height: `${bar.purchase}px`,
                        background: "linear-gradient(to top, #817AF3, #74B0FA)",
                      }}
                    />
                    <div
                      className="w-2.5 rounded-b-[40px]"
                      style={{
                        height: `${bar.sales}px`,
                        background: "linear-gradient(to top, #46A36C, #51CC5D)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-[122px] top-[293px] flex gap-5 text-[12px] text-gray-400">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
              ].map((month, idx) => (
                <span key={idx}>{month}</span>
              ))}
            </div>

            {/* Legends */}
            <div className="absolute left-[141px] top-[341px] flex items-center gap-2 text-[12px] text-gray-500">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background: "linear-gradient(to top, #817AF3, #74B0FA)",
                }}
              ></div>
              <span>Purchase</span>
              <div
                className="ml-6 w-4 h-4 rounded-full"
                style={{
                  background: "linear-gradient(to top, #46A36C, #51CC5D)",
                }}
              ></div>
              <span>Sales</span>
            </div>
          </section>

          {/* top selling stock */}

          <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Top Selling Stock
              </h2>
              <button className="btn bg-white text-blue-500">see all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-700 border-separate border-spacing-y-7">
                <thead>
                  <tr className="border-b border-gray-200 ">
                    <th className="py-2 px-4 font-medium text-left text-gray-600">
                      Name
                    </th>
                    <th className="py-2 px-4 font-medium text-left text-gray-600">
                      Sold Quantity
                    </th>
                    <th className="py-2 px-4 font-medium text-left text-gray-600">
                      Remaining Quantity
                    </th>
                    <th className="py-2 px-4 font-medium text-left text-gray-600">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 ">
                    <td className="py-3 px-4">Day old chicks</td>
                    <td className="py-3 px-4">30</td>
                    <td className="py-3 px-4">12</td>
                    <td className="py-3 px-4">GHS 100</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">Briolers</td>
                    <td className="py-3 px-4">21</td>
                    <td className="py-3 px-4">15</td>
                    <td className="py-3 px-4">GHS 207</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 ">
                    <td className="py-3 px-4">Dewormers</td>
                    <td className="py-3 px-4">19</td>
                    <td className="py-3 px-4">17</td>
                    <td className="py-3 px-4">GHS 105</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column - Adjusts based on screen size */}
        <div className="flex flex-col gap-6 w-full lg:w-[40%]">
          {/* Inventory Summary */}
          <section className="w-full bg-white rounded-lg p-4 shadow relative">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Inventory Summary
            </h2>
            <div className="flex justify-between items-start flex-wrap">
              <div className="flex flex-col items-center justify-center text-center  ">
                <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <BrickWall size={18} className="text-orange-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    868
                  </div>
                  <div className="text-sm text-gray-500">Quantity in hand</div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center mr-17">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <Warehouse size={18} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    200
                  </div>
                  <div className="text-sm text-gray-500">To be received</div>
                </div>
              </div>
            </div>
          </section>

          {/*  Product Summary */}

          <section className="w-full h-[145px] bg-white rounded-lg p-4 shadow relative">
            <h2 className="text-[20px] font-medium text-gray-800 mb-4">
              {" "}
              Product Summary
            </h2>
            <div className="flex justify-between items-start flex-wrap">
              <div className="flex flex-col items-center justify-center text-center  ">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <Users size={18} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    13
                  </div>
                  <div className="text-sm text-gray-500">
                    Number of suppliers
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center mr-12">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <ClipboardList size={18} className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-gray-600">
                    21
                  </div>
                  <div className="text-sm text-gray-500">
                    Number of categories
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sales Summary */}

          <SalesSummary />

          {/* Low Stock Items */}

          <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Low Quantity Stock
              </h2>
              <button className="btn bg-white text-blue-500">see all</button>
            </div>

            {/*chicken feed*/}

            <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 ">
              {/* Image */}
              <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={chickenFeed}
                  alt="Chicken Feed"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col justify-center flex-grow">
                <span className="text-[16px] font-semibold text-gray-800">
                  Chicken Feed
                </span>
                <span className="text-[14px] text-gray-500">
                  Remaining Quantity : 10 Packet
                </span>
              </div>

              {/* Status Tag */}
              <div className="flex-shrink-0">
                <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
                  Low
                </div>
              </div>
            </section>

            {/*broilers*/}

            <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 mt-6">
              {/* Image */}
              <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={broilers}
                  alt="broilers"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col justify-center flex-grow">
                <span className="text-[16px] font-semibold text-gray-800">
                  Broilers
                </span>
                <span className="text-[14px] text-gray-500">
                  Remaining Quantity : 15 Packet
                </span>
              </div>

              {/* Status Tag */}
              <div className="flex-shrink-0">
                <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
                  Low
                </div>
              </div>
            </section>

            {/*Day old chicks*/}
            <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 mt-6">
              {/* Image */}
              <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={day_old_chicks}
                  alt="day old chick"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col justify-center flex-grow">
                <span className="text-[16px] font-semibold text-gray-800">
                  Day old chicks
                </span>
                <span className="text-[14px] text-gray-500">
                  Remaining Quantity : 15 Packet
                </span>
              </div>

              {/* Status Tag */}
              <div className="flex-shrink-0">
                <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
                  Low
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
