import React, { useState, useEffect } from "react";
import { config } from "../../config/environment";
import Sidebar from "../../components/Sidebar";
import MetricCard from "../../components/ui/MetricCard";
import BestSellingProductCard from "../../components/ui/BestSellingProductCard";
import ProfitRevenueCard from "../../components/ui/ProfitRevenueCard";
import SalesDashboard from "../../components/ui/SalesDashboard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorBoundary from "../../components/common/ErrorBoundary";

const Sales = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    orders: [],
    totalOrders: 0,
    totalRevenue: 0,
    totalQuantity: 0,
    topProducts: [],
    topEmployees: [],
    stats: {
      totalSales: 0,
      totalReceived: 0,
      totalReturned: 0,
      totalRevenue: 0,
    },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${config.DJANGO_BASE_URL}/orders/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orders = await response.json();
        console.log("📊 Orders fetched:", orders);

        // Calculate statistics from orders
        let totalRevenue = 0;
        let totalQuantity = 0;
        const productSales = {};
        const employeeSales = {};

        orders.forEach((order) => {
          // Track employee sales
          const employeeUsername = order.created_by?.username || "Unknown";
          if (!employeeSales[employeeUsername]) {
            employeeSales[employeeUsername] = {
              username: employeeUsername,
              email: order.created_by?.email || "",
              totalOrders: 0,
              totalRevenue: 0,
            };
          }

          let orderTotal = 0;
          order.items.forEach((item) => {
            // Calculate totals
            const itemTotal =
              parseFloat(item.price_at_purchase) * item.quantity;
            totalRevenue += itemTotal;
            totalQuantity += item.quantity;
            orderTotal += itemTotal;

            // Track product sales
            const productName = item.product.name;
            if (!productSales[productName]) {
              productSales[productName] = {
                name: productName,
                category: item.product.category.name,
                totalQuantity: 0,
                totalRevenue: 0,
                sku: item.product.sku,
                soldBy: [], // Track which employees sold this product
              };
            }
            productSales[productName].totalQuantity += item.quantity;
            productSales[productName].totalRevenue += itemTotal;

            // Add employee to soldBy if not already present
            if (
              !productSales[productName].soldBy.some(
                (emp) => emp.username === employeeUsername
              )
            ) {
              productSales[productName].soldBy.push({
                username: employeeUsername,
                quantity: item.quantity,
              });
            } else {
              // Update existing employee quantity
              const empIndex = productSales[productName].soldBy.findIndex(
                (emp) => emp.username === employeeUsername
              );
              productSales[productName].soldBy[empIndex].quantity +=
                item.quantity;
            }
          });

          // Update employee totals
          employeeSales[employeeUsername].totalOrders++;
          employeeSales[employeeUsername].totalRevenue += orderTotal;
        });

        // Sort orders by date descending (latest first)
        const sortedOrders = orders.sort(
          (a, b) => new Date(b.order_date) - new Date(a.order_date)
        );

        // Get top 5 products by quantity sold
        const topProducts = Object.values(productSales)
          .sort((a, b) => b.totalQuantity - a.totalQuantity)
          .slice(0, 5);

        // Get top 5 employees by total revenue
        const topEmployees = Object.values(employeeSales)
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .slice(0, 5);

        setSalesData({
          orders: sortedOrders,
          totalOrders: orders.length,
          totalRevenue,
          totalQuantity,
          topProducts,
          topEmployees,
          stats: {
            totalSales: orders.length,
            totalReceived: orders.filter((order) => order.is_paid).length,
            totalReturned: 0, // No returns data in the API yet
            totalRevenue,
          },
        });

        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching sales data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner text-primary loading-lg"></div>
          <span className="ml-4 text-blue-400">Loading sales data...</span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>Error loading sales data: {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-outline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <section className="w-full p-3 mb-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Sales Overview
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* Total Sales */}
              <div className="w-full sm:w-[250px] p-4 bg-blue-50 rounded-md shadow-sm">
                <h3 className="text-blue-600 text-base font-semibold mb-2">
                  Total Sales Items
                </h3>
                <p className="text-gray-700 text-lg font-semibold">
                  {salesData.stats.totalSales}
                </p>
                <p className="text-sm text-gray-700 mt-2">All time</p>
              </div>

              {/* Total Revenue */}
              <div className="w-full sm:w-[250px] p-4 bg-green-50 rounded-md shadow-sm ml-7">
                <h3 className="text-green-600 text-base font-semibold mb-2">
                  Total Revenue
                </h3>
                <div className="flex justify-between text-gray-700 font-semibold">
                  <span>
                    GHS{" "}
                    {salesData.stats.totalRevenue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <span>All time</span>
                  <span>Revenue</span>
                </div>
              </div>

              {/* Total Quantity Sold */}
              <div className="w-full sm:w-[250px] p-4 bg-orange-50 rounded-md shadow-sm ml-7">
                <h3 className="text-orange-600 text-base font-semibold mb-2">
                  Items Sold
                </h3>
                <div className="flex justify-between text-gray-700 font-semibold">
                  <span>{salesData.totalQuantity}</span>
                  <span>Units</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <span>All time</span>
                  <span>Quantity</span>
                </div>
              </div>

              {/* Top Products */}
              <div className="w-full sm:w-[300px] p-4 bg-purple-50 rounded-md shadow-sm ml-7">
                <h3 className="text-purple-600 text-base font-semibold mb-2">
                  Top Selling Product
                </h3>
                {salesData.topProducts.length > 0 ? (
                  <div className="text-gray-800 font-semibold">
                    <div className="text-gray-900 font-bold">
                      {salesData.topProducts[0].name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {salesData.topProducts[0].totalQuantity} units sold
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm">No sales data</div>
                )}
              </div>
            </div>
          </section>

          {/* Top Products Section */}
          <section className="w-full p-3 mb-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Top Selling Products
            </h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-blue-600">
                    <th>Rank</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>Top Seller</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.topProducts.map((product, index) => (
                    <tr key={product.name}>
                      <td>
                        <span className="badge badge-primary">{index + 1}</span>
                      </td>
                      <td className="font-semibold text-gray-800">
                        {product.name}
                      </td>
                      <td>
                        <span className="badge badge-outline text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="text-sm text-gray-700">{product.sku}</td>
                      <td className="font-medium text-blue-600">
                        {product.totalQuantity} units
                      </td>
                      <td className="font-medium text-green-600">
                        GHS{" "}
                        {product.totalRevenue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-sm text-blue-600">
                        {product.soldBy && product.soldBy.length > 0
                          ? product.soldBy.sort(
                              (a, b) => b.quantity - a.quantity
                            )[0].username
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {salesData.topProducts.length === 0 && (
                <div className="text-center py-8 text-gray-700">
                  No sales data available
                </div>
              )}
            </div>
          </section>

          <section className="w-full mb-5 rounded-lg shadow-md">
            <SalesDashboard className="w-full" salesData={salesData} />
          </section>
        </>
      )}
    </>
  );
};

export default Sales;
