import React, { useMemo } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import MetricCard from "../../components/ui/MetricCard";
import StockCard from "../../components/ui/StockCard";
import SalesSummary from "../../components/SalesSummary";
import { useApi } from "../../hooks/useApi";
import { inventoryService } from "../../services/inventoryService";
import { SALES_OVERVIEW_DATA, LOW_STOCK_ITEMS } from "../../constants/mockData";
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
  // API calls for real data
  const { data: lowStockData, loading: lowStockLoading } = useApi(
    inventoryService.getLowStockItems
  );

  const salesMetrics = useMemo(
    () => [
      {
        icon: <BarChart3 />,
        value: `GHS ${SALES_OVERVIEW_DATA.sales}`,
        label: "Sales",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      {
        icon: <LineChart />,
        value: `GHS ${SALES_OVERVIEW_DATA.revenue}`,
        label: "Revenue",
        bgColor: "bg-green-100",
        iconColor: "text-green-500",
      },
      {
        icon: <PieChart />,
        value: `GHS ${SALES_OVERVIEW_DATA.profit}`,
        label: "Profit",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-500",
      },
      {
        icon: <DollarSign />,
        value: `GHS ${SALES_OVERVIEW_DATA.cost}`,
        label: "Cost",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
      },
    ],
    []
  );

  const purchaseMetrics = useMemo(
    () => [
      {
        icon: <CreditCard />,
        value: "GHS 832",
        label: "Purchase",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      {
        icon: <DollarSign />,
        value: "GHS 1,300",
        label: "Cost",
        bgColor: "bg-indigo-100",
        iconColor: "text-green-500",
      },
      {
        icon: <SquareX />,
        value: "GHS 868",
        label: "Cancel",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
      },
      {
        icon: <HandCoins />,
        value: "GHS 1,432",
        label: "Return",
        bgColor: "bg-green-100",
        iconColor: "text-green-500",
      },
    ],
    []
  );

  const inventoryMetrics = [
    {
      icon: <BrickWall />,
      value: "868",
      label: "Quantity in hand",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      icon: <Warehouse />,
      value: "200",
      label: "To be received",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
    },
  ];

  const productMetrics = [
    {
      icon: <Users />,
      value: "13",
      label: "Number of suppliers",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      icon: <ClipboardList />,
      value: "21",
      label: "Number of categories",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
  ];

  const topSellingProducts = [
    {
      name: "Day old chicks",
      soldQuantity: 30,
      remainingQuantity: 12,
      price: 100,
    },
    { name: "Broilers", soldQuantity: 21, remainingQuantity: 15, price: 207 },
    { name: "Dewormers", soldQuantity: 19, remainingQuantity: 17, price: 105 },
  ];

  // Use real data if available, fallback to mock data
  const displayLowStockItems = lowStockData || LOW_STOCK_ITEMS;

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

          {/* Purchase Overview */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Purchase Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {purchaseMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </section>

          {/* Sales & Purchase Chart */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Sales & Purchase
              </h2>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline">Weekly</button>
                <button className="btn btn-sm btn-primary">Daily</button>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart Component Coming Soon</p>
            </div>
          </section>

          {/* Top Selling Stock */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Top Selling Stock
              </h2>
              <button className="btn btn-sm btn-outline">See all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-2 font-medium text-gray-600">
                      Sold Quantity
                    </th>
                    <th className="text-left py-2 font-medium text-gray-600">
                      Remaining
                    </th>
                    <th className="text-left py-2 font-medium text-gray-600">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3">{product.name}</td>
                      <td className="py-3">{product.soldQuantity}</td>
                      <td className="py-3">{product.remainingQuantity}</td>
                      <td className="py-3">GHS {product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                <div key={index} className="text-center">
                  <MetricCard {...metric} />
                </div>
              ))}
            </div>
          </section>

          {/* Product Summary */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {productMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <MetricCard {...metric} />
                </div>
              ))}
            </div>
          </section>

          {/* Sales Summary Chart */}
          <SalesSummary />

          {/* Low Quantity Stock */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Low Quantity Stock
              </h2>
              <button className="btn btn-sm btn-outline">See all</button>
            </div>

            {lowStockLoading ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayLowStockItems.map((item, index) => (
                  <StockCard key={index} {...item} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
