import React, { useState, useEffect } from "react";
import SalesDashboard from "../../components/ui/SalesDashboard";
import { salesService } from "../../services/salesService";

const Sales = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    orderItems: [],
    totalSales: 0,
    totalRevenue: 0,
    totalQuantity: 0,
    topProducts: [],
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

        // Fetch order items from the API
        const response = await salesService.getOrderItems({
          limit: 1000, // Get all order items for comprehensive stats
        });

        console.log("📊 Order items response:", response);

        const orderItems = response.orderItems || [];

        // Calculate statistics from order items
        const totalRevenue = orderItems.reduce((sum, item) => {
          return sum + parseFloat(item.price_at_purchase) * item.quantity;
        }, 0);

        const totalQuantity = orderItems.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0);

        // Group by product to find top selling products
        const productSales = {};
        orderItems.forEach((item) => {
          const productName = item.product.name;
          if (!productSales[productName]) {
            productSales[productName] = {
              name: productName,
              category: item.product.category.name,
              totalQuantity: 0,
              totalRevenue: 0,
              sku: item.product.sku,
            };
          }
          productSales[productName].totalQuantity += item.quantity;
          productSales[productName].totalRevenue +=
            parseFloat(item.price_at_purchase) * item.quantity;
        });

        // Get top 5 products by quantity sold
        const topProducts = Object.values(productSales)
          .sort((a, b) => b.totalQuantity - a.totalQuantity)
          .slice(0, 5);

        setSalesData({
          orderItems,
          totalSales: orderItems.length,
          totalRevenue,
          totalQuantity,
          topProducts,
          stats: {
            totalSales: orderItems.length,
            totalReceived: orderItems.length, // All order items are received/completed
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
                  <div className="text-gray-700 font-semibold">
                    <div>{salesData.topProducts[0].name}</div>
                    <div className="text-sm text-gray-700 mt-1">
                      {salesData.topProducts[0].totalQuantity} units sold
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-700 text-sm">No sales data</div>
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
                  <tr>
                    <th>Rank</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.topProducts.map((product, index) => (
                    <tr key={product.name}>
                      <td>
                        <span className="badge badge-primary">{index + 1}</span>
                      </td>
                      <td className="font-semibold">{product.name}</td>
                      <td>
                        <span className="badge badge-outline">
                          {product.category}
                        </span>
                      </td>
                      <td className="text-sm text-gray-700">{product.sku}</td>
                      <td className="font-medium">
                        {product.totalQuantity} units
                      </td>
                      <td className="font-medium text-green-600">
                        GHS{" "}
                        {product.totalRevenue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
