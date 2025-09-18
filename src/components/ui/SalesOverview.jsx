import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  Eye,
  ShoppingCart,
  Clock,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

const SalesOverview = () => {
  const [salesData, setSalesData] = useState({
    todayOrderCount: 0,
    recentOrders: [],
    employeeSales: [],
    loading: true,
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    loadSalesData();
  }, [selectedDate]);

  const loadSalesData = async () => {
    try {
      setSalesData((prev) => ({ ...prev, loading: true }));

      // Get dashboard summary data
      const dashboardData = await dashboardService.getDashboardSummary();

      // Get orders for the selected date to calculate daily total
      const ordersResponse = await dashboardService.apiService.get("/orders/", {
        page_size: 1000,
        order_date__date: selectedDate,
      });

      const todayOrders = ordersResponse.results || [];

      // Calculate daily order count for selected date
      const todayOrderCount = todayOrders.length;

      // Group sales by employee for selected date
      const employeeSalesMap = {};

      for (const order of todayOrders) {
        const employeeId = order.created_by || "Unknown";

        if (!employeeSalesMap[employeeId]) {
          employeeSalesMap[employeeId] = {
            employeeId,
            employeeName: "Loading...",
            totalSales: 0,
            orderCount: 0,
            orders: [],
          };
        }

        employeeSalesMap[employeeId].totalSales += parseFloat(
          order.total_amount || 0
        );
        employeeSalesMap[employeeId].orderCount += 1;
        employeeSalesMap[employeeId].orders.push(order);
      }

      // Get employee names for those who made sales
      const employeeSales = await Promise.all(
        Object.values(employeeSalesMap).map(async (employeeData) => {
          try {
            if (employeeData.employeeId !== "Unknown") {
              const userResponse = await dashboardService.apiService.get(
                `/users/${employeeData.employeeId}/`
              );
              employeeData.employeeName =
                `${userResponse.first_name || ""} ${
                  userResponse.last_name || ""
                }`.trim() ||
                userResponse.email ||
                "Unknown";
            } else {
              employeeData.employeeName = "Unknown Employee";
            }
          } catch (error) {
            employeeData.employeeName = `Employee ID: ${employeeData.employeeId}`;
          }
          return employeeData;
        })
      );

      // Sort by total sales descending
      employeeSales.sort((a, b) => b.totalSales - a.totalSales);

      setSalesData({
        todayOrderCount,
        recentOrders: dashboardData.recent_orders?.slice(0, 3) || [],
        employeeSales,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load sales data:", error);
      setSalesData({
        todayOrderCount: 0,
        recentOrders: [],
        employeeSales: [],
        loading: false,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (salesData.loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Eye className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Sales Overview
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Daily Orders Total */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium text-sm mb-1">
                Total Orders for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {salesData.todayOrderCount} orders
              </p>
              <p className="text-blue-600 text-sm mt-1">
                {salesData.employeeSales.reduce(
                  (sum, emp) => sum + emp.orderCount,
                  0
                )}{" "}
                orders by employees
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Employee */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-gray-600" />
            <h3 className="text-md font-medium text-gray-900">
              Sales by Employee
            </h3>
          </div>

          {salesData.employeeSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No sales for selected date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {salesData.employeeSales.map((employee, index) => (
                <div
                  key={employee.employeeId}
                  className="bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-1.5 rounded-full">
                        <User className="h-3 w-3 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {employee.employeeName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {employee.orderCount} order
                          {employee.orderCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">
                        {formatCurrency(employee.totalSales)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-4 w-4 text-gray-600" />
            <h3 className="text-md font-medium text-gray-900">Recent Orders</h3>
          </div>

          {salesData.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No recent orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {salesData.recentOrders.map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        #{order.ref_code}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(order.order_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            order.is_paid ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-500">
                          {order.is_paid ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
