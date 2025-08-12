import React, { useState, useEffect } from "react";
import { apiIntegration } from "../services/apiIntegration";
import { inventoryService } from "../services/inventoryService";
import { salesService } from "../services/salesService";
import { paymentService } from "../services/paymentService";
import { deliveryService } from "../services/deliveryService";
import TokenDebugger from "../components/ui/TokenDebugger";

const ApiIntegrationTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name, testFunction) => {
    try {
      setTestResults((prev) => ({ ...prev, [name]: { status: "testing" } }));
      const result = await testFunction();
      setTestResults((prev) => ({
        ...prev,
        [name]: {
          status: "success",
          data: result,
          count:
            result?.count || result?.results?.length || result?.length || "N/A",
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [name]: {
          status: "error",
          error: error.message,
        },
      }));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});

    const tests = [
      { name: "API Health Check", fn: () => apiIntegration.healthCheck() },
      {
        name: "Products",
        fn: () => apiIntegration.products.getAll({ page_size: 5 }),
      },
      {
        name: "Orders",
        fn: () => apiIntegration.orders.getAll({ page_size: 5 }),
      },
      {
        name: "Inventory",
        fn: () => apiIntegration.inventory.getAll({ page_size: 5 }),
      },
      {
        name: "Payments",
        fn: () => apiIntegration.payments.getAll({ page_size: 5 }),
      },
      {
        name: "Deliveries",
        fn: () => apiIntegration.deliveries.getAll({ page_size: 5 }),
      },
      {
        name: "Dashboard Summary",
        fn: () => apiIntegration.dashboard.getSummary(),
      },
      {
        name: "Top Selling Products",
        fn: () => inventoryService.getTopSellingProducts(3),
      },
      {
        name: "Low Stock Items",
        fn: () => inventoryService.getLowStockItems(),
      },
      { name: "Recent Sales", fn: () => salesService.getSales({ limit: 3 }) },
    ];

    for (const test of tests) {
      await testEndpoint(test.name, test.fn);
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "testing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "testing":
        return "⏳";
      default:
        return "⏱️";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Token Debugger */}
      <TokenDebugger />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Backend API Integration Test
        </h1>
        <p className="text-gray-600">
          Testing connection to all backend endpoints
        </p>
        <button
          onClick={runAllTests}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Running Tests..." : "Run Tests Again"}
        </button>
      </div>

      <div className="grid gap-4">
        {Object.entries(testResults).map(([name, result]) => (
          <div key={name} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{name}</h3>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  result.status
                )}`}
              >
                {getStatusIcon(result.status)} {result.status?.toUpperCase()}
              </div>
            </div>

            {result.status === "success" && (
              <div className="text-sm text-gray-600">
                {result.count !== "N/A" && (
                  <p>
                    Records found:{" "}
                    <span className="font-medium">{result.count}</span>
                  </p>
                )}
                {result.data && typeof result.data === "object" && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View Response
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {result.status === "error" && (
              <p className="text-sm text-red-600">Error: {result.error}</p>
            )}

            {result.status === "testing" && (
              <p className="text-sm text-yellow-600">Testing endpoint...</p>
            )}
          </div>
        ))}
      </div>

      {Object.keys(testResults).length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Click "Run Tests" to test API integration
        </div>
      )}
    </div>
  );
};

export default ApiIntegrationTest;
