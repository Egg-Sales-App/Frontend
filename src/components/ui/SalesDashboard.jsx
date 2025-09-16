import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { config } from "../../config/environment";

const SalesDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("weekly");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
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

      const orderItems = await response.json();
      console.log("📊 SalesDashboard - Order items fetched:", orderItems);

      // Transform the API data to match our table format
      const transformedOrders = orderItems.map((order) => {
        const orderDate = new Date(order.order_date);
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Calculate order total
        const orderTotal = order.items.reduce((total, item) => {
          return total + parseFloat(item.price_at_purchase) * item.quantity;
        }, 0);

        // Get main product name (first item) or combine if multiple
        const productNames = order.items.map((item) => item.product.name);
        const displayProduct =
          productNames.length > 1
            ? `${productNames[0]} + ${productNames.length - 1} more`
            : productNames[0];

        // Calculate total quantity
        const totalQuantity = order.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          id: order.id,
          product: displayProduct,
          value: `GHS ${orderTotal.toFixed(2)}`,
          quantity: `${totalQuantity} Items`,
          date: orderDate.toLocaleDateString("en-GB"),
          payment: order.is_paid ? "Paid" : "Pending",
          status: order.is_paid ? "Completed" : "Pending",
          period: orderDate >= weekAgo ? "weekly" : "daily",
          rawDate: orderDate,
          orderDetails: order, // Keep full order for reference
        };
      });

      setOrders(transformedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders data");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => order.period === period);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
    setCurrentPage(1); // Reset to page 1 when period changes
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full h-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-blue-600 font-semibold">Sales</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handlePeriodChange("daily")}
            className={`px-4 py-2 rounded ${
              period === "daily"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => handlePeriodChange("weekly")}
            className={`px-4 py-2 rounded ${
              period === "weekly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Recent
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-gray-800">Loading sales data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={fetchOrdersData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Container - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Order Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {order.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-900">
                        {order.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "completed" ||
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending" ||
                              order.status === "processing"
                            ? "bg-orange-100 text-orange-800"
                            : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "cancelled" ||
                              order.status === "returned"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <p className="text-gray-700 text-lg">No orders found</p>
              <p className="text-gray-600 text-sm">
                Try switching to a different time period
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredOrders.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-800">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
                {filteredOrders.length} results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700 px-4">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesDashboard;
