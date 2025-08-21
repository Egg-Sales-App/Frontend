import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";
import { useToast } from "../../components/ui/ToastContext";
import {
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  Warehouse,
  Target,
  AlertCircle,
  RefreshCw,
  Plus,
  FileText,
  Download,
  UserPlus,
  ChevronRight,
  Eye,
  Star,
  Calendar,
  ShoppingCart,
  CreditCard,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  CheckCircle,
  Clock,
  Package2,
} from "lucide-react";

const Dashboard = () => {
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");
  const hasInitialized = useRef(false);

  // Fetch dashboard data
  useEffect(() => {
    if (hasInitialized.current) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        hasInitialized.current = true;

        info("Loading dashboard data...");

        // Use your actual dashboard API endpoint
        const data = await dashboardService.getDashboardSummary();
        setDashboardData(data);

        success("Dashboard data loaded successfully");
      } catch (error) {
        showError("Failed to load dashboard data");
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Quick Actions Configuration
  const quickActions = [
    {
      title: "Add New Stock",
      description: "Add products to inventory",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => navigate("/admin/inventory"),
    },
    {
      title: "Generate Invoice",
      description: "Create new sales invoice",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => navigate("/admin/sales"),
    },
    {
      title: "Export Reports",
      description: "Download business reports",
      icon: <Download className="h-5 w-5" />,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => navigate("/admin/reports"),
    },
    {
      title: "Manage Employees",
      description: "Add or manage staff",
      icon: <UserPlus className="h-5 w-5" />,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => navigate("/admin/employees"),
    },
  ];

  // Mock data for features not yet in backend
  const salesInsights = [
    {
      label: "🐥 Broiler Sales",
      value: "GHS 2,450",
      change: "+12%",
      trend: "up",
    },
    { label: "🥚 Egg Sales", value: "GHS 1,230", change: "-5%", trend: "down" },
    { label: "🌾 Feed Sales", value: "GHS 3,890", change: "+25%", trend: "up" },
    {
      label: "🛠️ Equipment Sales",
      value: "GHS 567",
      change: "+8%",
      trend: "up",
    },
  ];

  const customerMetrics = [
    { label: "New Customers", value: "24", change: "+15%" },
    { label: "Returning Customers", value: "156", change: "+8%" },
    { label: "Customer Satisfaction", value: "4.8/5", change: "+0.2" },
    { label: "Average Order Value", value: "GHS 245", change: "+12%" },
  ];

  const employeePerformance = [
    { name: "John Doe", sales: "GHS 2,450", orders: 25, rating: 4.8 },
    { name: "Jane Smith", sales: "GHS 1,890", orders: 18, rating: 4.6 },
    { name: "Mike Johnson", sales: "GHS 1,567", orders: 15, rating: 4.7 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <div className="loading loading-spinner text-primary loading-lg"></div>
        <span className="ml-4 text-blue-400">Loading dashboard...</span>
      </div>
    );
  }

  // Extract data from API response
  const summary = dashboardData?.summary || {};
  const lowStockProducts = dashboardData?.low_stock_products || [];
  const recentOrders = dashboardData?.recent_orders || [];
  const topSellingProducts = dashboardData?.top_selling_products || [];

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ashford Store Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your business overview for {timeRange}.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm min-w-[120px]"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors shadow-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* 1. Top-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                🐥 Total Sales ({timeRange})
              </p>
              <p className="text-3xl font-bold text-gray-900">
                GHS {summary.total_revenue || "0.00"}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-500">
                  {summary.total_orders || 0} orders
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Current Stock Value */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                📦 Stock Value
              </p>
              <p className="text-2xl font-bold text-gray-900">GHS 25,430</p>
              <div className="flex items-center mt-2">
                <Package className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {summary.total_products || 0} products
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Warehouse className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Profit Margins */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                💰 Profit Margin
              </p>
              <p className="text-2xl font-bold text-gray-900">32.5%</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-500">This month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Best-Selling Category */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                👥 Top Category
              </p>
              <p className="text-lg font-bold text-gray-900">Broiler Feed</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-500">Best performer</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">⚠️ Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {lowStockProducts.length}
              </p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-gray-500">
                  Items need attention
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Outstanding Debts */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                📊 Credit Sales
              </p>
              <p className="text-lg font-bold text-gray-900">GHS 1,250</p>
              <div className="flex items-center mt-2">
                <CreditCard className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm text-gray-500">5 pending</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sales Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📊 Sales Insights
            </h2>
            <select className="text-sm border rounded px-2 py-1">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>This month</option>
            </select>
          </div>
          <div className="space-y-4">
            {salesInsights.map((insight, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {insight.label}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {insight.value}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      insight.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {insight.change}
                  </div>
                  {insight.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 ml-auto" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              🏆 Top 5 Products
            </h2>
            <button
              onClick={() => navigate("/admin/reports")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {topSellingProducts.length > 0 ? (
            <div className="space-y-3">
              {topSellingProducts.slice(0, 5).map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.total_sold} units sold
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      GHS {product.total_revenue}
                    </div>
                    <div className="text-sm text-gray-500">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No sales data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Inventory Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            📦 Inventory Overview
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/admin/inventory")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              Manage Inventory <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 text-sm font-medium">
              Total Products
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {summary.total_products || 0}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 text-sm font-medium">In Stock</div>
            <div className="text-2xl font-bold text-green-900">
              {(summary.total_products || 0) - lowStockProducts.length}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-yellow-600 text-sm font-medium">Low Stock</div>
            <div className="text-2xl font-bold text-yellow-900">
              {lowStockProducts.length}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-red-600 text-sm font-medium">Out of Stock</div>
            <div className="text-2xl font-bold text-red-900">0</div>
          </div>
        </div>

        {/* Low Stock Items */}
        {lowStockProducts.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Low Stock Alerts ({lowStockProducts.length} items)
            </h3>
            <div className="space-y-2">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Only {product.quantity_in_stock} left
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Low Stock
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/admin/inventory?product=${product.id}`)
                      }
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Customer Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            👥 Customer Overview
          </h2>
          <button
            onClick={() => navigate("/admin/customers")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {customerMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm font-medium">
                {metric.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <div className="text-green-600 text-sm font-medium">
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Employee Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            👨‍💼 Employee Performance
          </h2>
          <button
            onClick={() => navigate("/admin/employees")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            Manage Staff <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Employee
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Sales
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Orders
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Rating
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employeePerformance.map((employee, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-900">
                        {employee.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{employee.sales}</td>
                  <td className="py-3 px-4">{employee.orders}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{employee.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📋 Recent Orders
            </h2>
            <button
              onClick={() => navigate("/admin/sales")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">#{order.ref_code}</td>
                    <td className="py-3 px-4">{order.customer_name}</td>
                    <td className="py-3 px-4 font-medium">
                      GHS {order.total_amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.is_paid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.is_paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`flex items-center justify-between p-4 ${action.color} text-white rounded-lg transition-colors`}
            >
              <div className="flex items-center gap-3">
                {action.icon}
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Business Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">📈 Business Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {summary.total_customers || 0}
            </div>
            <div className="text-indigo-100">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {summary.total_products || 0}
            </div>
            <div className="text-indigo-100">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {summary.total_suppliers || 0}
            </div>
            <div className="text-indigo-100">Suppliers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {summary.pending_deliveries || 0}
            </div>
            <div className="text-indigo-100">Pending Deliveries</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// old dashboard
// import React, { useMemo, useEffect, useState } from "react";
// import AdminLayout from "../../components/layout/AdminLayout";
// import MetricCard from "../../components/ui/MetricCard";
// import StockCard from "../../components/ui/StockCard";
// import SalesSummary from "../../components/SalesSummary";
// import { useApi } from "../../hooks/useApi";
// import { inventoryService } from "../../services/inventoryService";
// import { salesService } from "../../services/salesService";
// import { reportsService } from "../../services/reportsService";
// import { useToast } from "../../components/ui/ToastContext";

// import chickenFeed from "../../assets/chicken_feed.png";
// import broilers from "../../assets/broilers.jpeg";
// import day_old_chicks from "../../assets/day_old_chicks.jpg";
// import {
//   BarChart3,
//   LineChart,
//   PieChart,
//   DollarSign,
//   CreditCard,
//   SquareX,
//   HandCoins,
//   BrickWall,
//   Warehouse,
//   Users,
//   ClipboardList,
// } from "lucide-react";

// const Dashboard = () => {
//   const { error: showError } = useToast();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // Fetch all dashboard data in parallel
//         const [summary, lowStock, topSelling, salesChart] =
//           await Promise.allSettled([
//             reportsService.getDashboardSummary(),
//             inventoryService.getLowStockItems(),
//             inventoryService.getTopSellingProducts(5),
//             salesService.getSalesChartData("30d"),
//           ]);

//         setDashboardData({
//           summary: summary.status === "fulfilled" ? summary.value : null,
//           lowStock: lowStock.status === "fulfilled" ? lowStock.value : [],
//           topSelling: topSelling.status === "fulfilled" ? topSelling.value : [],
//           salesChart: salesChart.status === "fulfilled" ? salesChart.value : [],
//         });

//         // Show errors for failed requests
//         if (summary.status === "rejected") {
//           showError("Failed to load dashboard summary");
//         }
//       } catch (error) {
//         showError("Failed to load dashboard data");
//         console.error("Dashboard data fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [showError]);

//   // Sales metrics with real data
//   const salesMetrics = useMemo(() => {
//     const summary = dashboardData?.summary;
//     if (!summary) return [];

//     return [
//       {
//         icon: <BarChart3 />,
//         value: `GHS ${summary.sales?.total || 0}`,
//         label: "Total Sales",
//         bgColor: "bg-blue-100",
//         iconColor: "text-blue-500",
//       },
//       {
//         icon: <LineChart />,
//         value: `GHS ${summary.revenue?.total || 0}`,
//         label: "Revenue",
//         bgColor: "bg-green-100",
//         iconColor: "text-green-500",
//       },
//       {
//         icon: <PieChart />,
//         value: `GHS ${summary.profit?.total || 0}`,
//         label: "Profit",
//         bgColor: "bg-purple-100",
//         iconColor: "text-purple-500",
//       },
//       {
//         icon: <DollarSign />,
//         value: `GHS ${summary.expenses?.total || 0}`,
//         label: "Expenses",
//         bgColor: "bg-orange-100",
//         iconColor: "text-orange-500",
//       },
//     ];
//   }, [dashboardData]);

//   // Inventory metrics
//   const inventoryMetrics = useMemo(() => {
//     const summary = dashboardData?.summary;
//     if (!summary) return [];

//     return [
//       {
//         icon: <BrickWall />,
//         value: summary.inventory?.totalItems || "0",
//         label: "Total Products",
//         bgColor: "bg-orange-100",
//         iconColor: "text-orange-500",
//       },
//       {
//         icon: <Warehouse />,
//         value: summary.inventory?.lowStockCount || "0",
//         label: "Low Stock Items",
//         bgColor: "bg-red-100",
//         iconColor: "text-red-500",
//       },
//     ];
//   }, [dashboardData]);

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="flex justify-center items-center h-64">
//           <div className="loading loading-spinner text-primary loading-lg"></div>
//           <span className="ml-4 text-blue-400">Loading dashboard...</span>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <>
//       <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
//         {/* Left Column - Adjusts based on screen size */}
//         <div className="flex flex-col gap-6 w-full lg:w-[60%]">
//           {/* Sales Overview section */}
//           <section className="w-full bg-white rounded-lg p-4 shadow relative">
//             <h2 className="text-xl font-medium text-gray-800 mb-4">
//               Sales Overview
//             </h2>
//             <div className="flex justify-between items-start flex-wrap">
//               <div className="flex items-center gap-3 w-[116px]">
//                 <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
//                   <BarChart3 size={18} className="text-secondary" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 832
//                   </div>
//                   <div className="text-sm text-gray-500">Sales</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 w-[163px]">
//                 <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
//                   <LineChart size={18} className="text-indigo-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 1,300
//                   </div>
//                   <div className="text-sm text-gray-500">Revenue</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 w-[117px]">
//                 <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
//                   <PieChart size={18} className="text-orange-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 868
//                   </div>
//                   <div className="text-sm text-gray-500">Profit</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 w-[131px]">
//                 <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
//                   <DollarSign size={18} className="text-green-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 1,432
//                   </div>
//                   <div className="text-sm text-gray-500">Cost</div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Purchase Overview section */}
//           <section className="w-full h-[120px] bg-white rounded-lg p-4 shadow relative">
//             <h2 className="text-[20px] font-medium text-gray-800 mb-4">
//               Purchase Overview
//             </h2>
//             <div className="flex justify-between items-start flex-wrap">
//               <div className="flex items-center gap-3 w-[116px]">
//                 <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
//                   <CreditCard size={18} className="text-blue-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 832
//                   </div>
//                   <div className="text-sm text-gray-500">Purchase</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 w-[163px]">
//                 <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
//                   <DollarSign size={18} className="text-green-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 1,300
//                   </div>
//                   <div className="text-sm text-gray-500">Cost</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 w-[117px]">
//                 <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
//                   <SquareX size={18} className="text-orange-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 868
//                   </div>
//                   <div className="text-sm text-gray-500">Cancel</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 w-[131px]">
//                 <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
//                   <HandCoins size={18} className="text-green-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     GHS 1,432
//                   </div>
//                   <div className="text-sm text-gray-500">Return</div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Sales & Purchase Chart section */}
//           <section className="relative w-full h-[360px] bg-white rounded-[10px] shadow-md p-4 overflow-hidden">
//             <div className="flex justify-between items-center mb-2">
//               <h2 className="text-[20px] text-gray-800 font-medium">
//                 Sales & Purchase
//               </h2>
//               <div className="flex gap-2">
//                 <button className="btn bg-green-300 px-4 py-1 rounded shadow-sm text-sm text-gray-600">
//                   Weekly
//                 </button>
//                 <button className="btn bg-green-300 px-4 py-1 rounded shadow-sm text-sm text-gray-600">
//                   Daily
//                 </button>
//               </div>
//             </div>

//             {/* Y-axis Labels */}
//             <div className="absolute left-4 top-[74px] flex flex-col justify-between h-[218px] text-xs text-gray-500">
//               {["60,000", "50,000", "40,000", "30,000", "20,000", "10,000"].map(
//                 (val, idx) => (
//                   <span key={idx}>{val}</span>
//                 )
//               )}
//             </div>

//             {/* Chart Grid */}
//             <div className="absolute top-[82px] left-[101px]">
//               {[...Array(6)].map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="w-[460px] h-[41px] border-b border-gray-300"
//                 ></div>
//               ))}
//             </div>

//             {/* Bars */}
//             <div className="absolute top-[89px] left-[120px] flex gap-4 items-end">
//               {[
//                 { purchase: 186, sales: 163 },
//                 { purchase: 198, sales: 157 },
//                 { purchase: 144, sales: 177 },
//                 { purchase: 112, sales: 139 },
//                 { purchase: 139, sales: 151 },
//                 { purchase: 78, sales: 130 },
//                 { purchase: 186, sales: 163 },
//                 { purchase: 144, sales: 134 },
//                 { purchase: 144, sales: 139 },
//                 { purchase: 112, sales: 139 },
//               ].map((bar, idx) => (
//                 <div key={idx} className="flex flex-col items-center">
//                   <div className="flex gap-1 items-end">
//                     <div
//                       className="w-2.5 rounded-b-[40px]"
//                       style={{
//                         height: `${bar.purchase}px`,
//                         background: "linear-gradient(to top, #817AF3, #74B0FA)",
//                       }}
//                     />
//                     <div
//                       className="w-2.5 rounded-b-[40px]"
//                       style={{
//                         height: `${bar.sales}px`,
//                         background: "linear-gradient(to top, #46A36C, #51CC5D)",
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* X-axis labels */}
//             <div className="absolute left-[122px] top-[293px] flex gap-5 text-[12px] text-gray-400">
//               {[
//                 "Jan",
//                 "Feb",
//                 "Mar",
//                 "Apr",
//                 "May",
//                 "Jun",
//                 "Jul",
//                 "Aug",
//                 "Sep",
//                 "Oct",
//               ].map((month, idx) => (
//                 <span key={idx}>{month}</span>
//               ))}
//             </div>

//             {/* Legends */}
//             <div className="absolute left-[141px] top-[341px] flex items-center gap-2 text-[12px] text-gray-500">
//               <div
//                 className="w-4 h-4 rounded-full"
//                 style={{
//                   background: "linear-gradient(to top, #817AF3, #74B0FA)",
//                 }}
//               ></div>
//               <span>Purchase</span>
//               <div
//                 className="ml-6 w-4 h-4 rounded-full"
//                 style={{
//                   background: "linear-gradient(to top, #46A36C, #51CC5D)",
//                 }}
//               ></div>
//               <span>Sales</span>
//             </div>
//           </section>

//           {/* top selling stock */}

//           <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Top Selling Stock
//               </h2>
//               <button className="btn bg-white text-blue-500">see all</button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-left text-sm text-gray-700 border-separate border-spacing-y-7">
//                 <thead>
//                   <tr className="border-b border-gray-200 ">
//                     <th className="py-2 px-4 font-medium text-left text-gray-600">
//                       Name
//                     </th>
//                     <th className="py-2 px-4 font-medium text-left text-gray-600">
//                       Sold Quantity
//                     </th>
//                     <th className="py-2 px-4 font-medium text-left text-gray-600">
//                       Remaining Quantity
//                     </th>
//                     <th className="py-2 px-4 font-medium text-left text-gray-600">
//                       Price
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className="border-b border-gray-100 hover:bg-gray-50 ">
//                     <td className="py-3 px-4">Day old chicks</td>
//                     <td className="py-3 px-4">30</td>
//                     <td className="py-3 px-4">12</td>
//                     <td className="py-3 px-4">GHS 100</td>
//                   </tr>
//                   <tr className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-3 px-4">Briolers</td>
//                     <td className="py-3 px-4">21</td>
//                     <td className="py-3 px-4">15</td>
//                     <td className="py-3 px-4">GHS 207</td>
//                   </tr>
//                   <tr className="border-b border-gray-100 hover:bg-gray-50 ">
//                     <td className="py-3 px-4">Dewormers</td>
//                     <td className="py-3 px-4">19</td>
//                     <td className="py-3 px-4">17</td>
//                     <td className="py-3 px-4">GHS 105</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </div>

//         {/* Right Column - Adjusts based on screen size */}
//         <div className="flex flex-col gap-6 w-full lg:w-[40%]">
//           {/* Inventory Summary */}
//           <section className="w-full bg-white rounded-lg p-4 shadow relative">
//             <h2 className="text-xl font-medium text-gray-800 mb-4">
//               Inventory Summary
//             </h2>
//             <div className="flex justify-between items-start flex-wrap">
//               <div className="flex flex-col items-center justify-center text-center  ">
//                 <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
//                   <BrickWall size={18} className="text-orange-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     868
//                   </div>
//                   <div className="text-sm text-gray-500">Quantity in hand</div>
//                 </div>
//               </div>

//               <div className="flex flex-col items-center justify-center text-center mr-17">
//                 <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
//                   <Warehouse size={18} className="text-purple-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     200
//                   </div>
//                   <div className="text-sm text-gray-500">To be received</div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/*  Product Summary */}

//           <section className="w-full h-[145px] bg-white rounded-lg p-4 shadow relative">
//             <h2 className="text-[20px] font-medium text-gray-800 mb-4">
//               {" "}
//               Product Summary
//             </h2>
//             <div className="flex justify-between items-start flex-wrap">
//               <div className="flex flex-col items-center justify-center text-center  ">
//                 <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
//                   <Users size={18} className="text-blue-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     13
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Number of suppliers
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col items-center justify-center text-center mr-12">
//                 <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
//                   <ClipboardList size={18} className="text-yellow-500" />
//                 </div>
//                 <div>
//                   <div className="text-[16px] font-semibold text-gray-600">
//                     21
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Number of categories
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Sales Summary */}

//           <SalesSummary />

//           {/* Low Stock Items */}

//           <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Low Quantity Stock
//               </h2>
//               <button className="btn bg-white text-blue-500">see all</button>
//             </div>

//             {/*chicken feed*/}

//             <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 ">
//               {/* Image */}
//               <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
//                 <img
//                   src={chickenFeed}
//                   alt="Chicken Feed"
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Text Info */}
//               <div className="flex flex-col justify-center flex-grow">
//                 <span className="text-[16px] font-semibold text-gray-800">
//                   Chicken Feed
//                 </span>
//                 <span className="text-[14px] text-gray-500">
//                   Remaining Quantity : 10 Packet
//                 </span>
//               </div>

//               {/* Status Tag */}
//               <div className="flex-shrink-0">
//                 <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
//                   Low
//                 </div>
//               </div>
//             </section>

//             {/*broilers*/}

//             <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 mt-6">
//               {/* Image */}
//               <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
//                 <img
//                   src={broilers}
//                   alt="broilers"
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Text Info */}
//               <div className="flex flex-col justify-center flex-grow">
//                 <span className="text-[16px] font-semibold text-gray-800">
//                   Broilers
//                 </span>
//                 <span className="text-[14px] text-gray-500">
//                   Remaining Quantity : 15 Packet
//                 </span>
//               </div>

//               {/* Status Tag */}
//               <div className="flex-shrink-0">
//                 <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
//                   Low
//                 </div>
//               </div>
//             </section>

//             {/*Day old chicks*/}
//             <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2 mt-6">
//               {/* Image */}
//               <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
//                 <img
//                   src={day_old_chicks}
//                   alt="day old chick"
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Text Info */}
//               <div className="flex flex-col justify-center flex-grow">
//                 <span className="text-[16px] font-semibold text-gray-800">
//                   Day old chicks
//                 </span>
//                 <span className="text-[14px] text-gray-500">
//                   Remaining Quantity : 15 Packet
//                 </span>
//               </div>

//               {/* Status Tag */}
//               <div className="flex-shrink-0">
//                 <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
//                   Low
//                 </div>
//               </div>
//             </section>
//           </section>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;
