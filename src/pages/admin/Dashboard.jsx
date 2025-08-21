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
