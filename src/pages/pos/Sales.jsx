import React, { useState, useEffect } from "react";
import SalesDashboard from "../../components/ui/SalesDashboard";
import { config } from "../../config/environment";
import { useAuth } from "../../hooks/useAuth";

const Sales = () => {
  const { user } = useAuth(); // Get current logged-in user
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalQuantity: 0,
    last7DaysOrders: 0,
    last7DaysRevenue: 0,
    returns: 0,
    returnsValue: 0,
  });
  const [error, setError] = useState(null);

  const fetchOrderItems = async () => {
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
      console.log("📊 All orders fetched:", orderItems);

      // Filter orders to show only those created by the current user
      const userOrders = orderItems.filter(
        (order) =>
          order.created_by && order.created_by.username === user?.username
      );

      console.log("📊 User-specific orders:", userOrders);
      console.log("📊 Current user:", user?.username);

      // Calculate statistics from real data
      const calculateStats = (orders) => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        let totalOrders = orders.length;
        let totalRevenue = 0;
        let totalQuantity = 0;
        let last7DaysOrders = 0;
        let last7DaysRevenue = 0;
        let returns = 0;
        let returnsValue = 0;

        orders.forEach((order) => {
          const orderDate = new Date(order.order_date);
          let orderTotal = 0;
          let orderQuantity = 0;

          // Calculate order total and quantity
          order.items.forEach((item) => {
            const itemTotal =
              parseFloat(item.price_at_purchase) * item.quantity;
            orderTotal += itemTotal;
            orderQuantity += item.quantity;
          });

          totalRevenue += orderTotal;
          totalQuantity += orderQuantity;

          // Check if order is within last 7 days
          if (orderDate >= sevenDaysAgo) {
            last7DaysOrders++;
            last7DaysRevenue += orderTotal;
          }

          // Mock returns calculation (since we don't have return data in the API)
          if (order.is_paid === false && orderDate < sevenDaysAgo) {
            returns++;
            returnsValue += orderTotal * 0.1; // Assume 10% return value
          }
        });

        return {
          totalOrders,
          totalRevenue,
          totalQuantity,
          last7DaysOrders,
          last7DaysRevenue,
          returns,
          returnsValue,
        };
      };

      const stats = calculateStats(userOrders);
      setSalesData(stats);
    } catch (err) {
      console.error("❌ Error fetching order items:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner text-primary loading-lg"></div>
          <span className="ml-4 text-blue-400">Loading Sales...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={fetchOrderItems}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <section className="w-full p-3 mb-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              My Sales Overview
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Sales made by:{" "}
              <span className="font-semibold text-blue-600">
                {user?.username || "Unknown User"}
              </span>
            </p>

            {salesData.totalOrders === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Sales Yet
                </h3>
                <p className="text-gray-500">
                  You haven't made any sales yet. Start selling to see your
                  statistics here!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {/* Total Sales */}
                <div className="w-full sm:w-[250px] p-4 bg-blue-50 rounded-md shadow-sm">
                  <h3 className="text-blue-600 text-base font-semibold mb-2">
                    My Total Orders
                  </h3>
                  <p className="text-gray-700 text-lg font-semibold">
                    {salesData.totalOrders}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">All time</p>
                </div>

                {/* Total Received */}
                <div className="w-full sm:w-[250px] p-4 bg-orange-50 rounded-md shadow-sm ml-7">
                  <h3 className="text-orange-600 text-base font-semibold mb-2">
                    Recent Sales
                  </h3>
                  <div className="flex justify-between text-gray-700 font-semibold">
                    <span>{salesData.last7DaysOrders}</span>
                    <span>
                      GHS{" "}
                      {salesData.last7DaysRevenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 mt-2">
                    <span>Last 7 days</span>
                    <span>Revenue</span>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="w-full sm:w-[250px] p-4 bg-green-50 rounded-md shadow-sm ml-7">
                  <h3 className="text-green-600 text-base font-semibold mb-2">
                    My Total Revenue
                  </h3>
                  <div className="flex justify-between text-gray-700 font-semibold">
                    <span>{salesData.totalQuantity} items</span>
                    <span>
                      GHS{" "}
                      {salesData.totalRevenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 mt-2">
                    <span>All time</span>
                    <span>Total</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {salesData.totalOrders > 0 && (
            <section className="w-full mb-5 rounded-lg shadow-md">
              <SalesDashboard className="w-full" userFilter={user?.username} />
            </section>
          )}
        </>
      )}
    </>
  );
};

export default Sales;
