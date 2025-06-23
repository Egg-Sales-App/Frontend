import React, { useState } from "react";
import {
  testBackendConnection,
  testEndpoints,
  testAuth,
  testDataFetch,
  runComprehensiveTests,
} from "../utils/testConnection";

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "admin@example.com",
    password: "password123",
  });

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setTestResults((prev) => ({
      ...prev,
      [testName]: { status: "running", result: null, timestamp: new Date() },
    }));

    try {
      const result = await testFunction();
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          status: "success",
          result,
          timestamp: new Date(),
          duration: Date.now() - (prev[testName]?.timestamp?.getTime() || 0),
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          status: "error",
          result: error.message,
          timestamp: new Date(),
          duration: Date.now() - (prev[testName]?.timestamp?.getTime() || 0),
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: "connection",
      label: "Backend Connection",
      description: "Test basic connectivity to backend",
      fn: testBackendConnection,
    },
    {
      name: "endpoints",
      label: "Multiple Endpoints",
      description: "Test various API endpoints",
      fn: testEndpoints,
    },
    {
      name: "auth",
      label: "Authentication",
      description: "Test login functionality",
      fn: () => testAuth(credentials),
    },
    {
      name: "products",
      label: "Products Endpoint",
      description: "Test products API",
      fn: () => testDataFetch("/products", { limit: 5 }),
    },
    {
      name: "categories",
      label: "Categories Endpoint",
      description: "Test categories API",
      fn: () => testDataFetch("/products/categories"),
    },
    {
      name: "comprehensive",
      label: "Full Test Suite",
      description: "Run all tests in sequence",
      fn: runComprehensiveTests,
    },
  ];

  const runAllTests = async () => {
    setLoading(true);
    try {
      const results = await runComprehensiveTests();
      setTestResults((prev) => ({
        ...prev,
        comprehensive: {
          status: "success",
          result: results,
          timestamp: new Date(),
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        comprehensive: {
          status: "error",
          result: error.message,
          timestamp: new Date(),
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return "🔄";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⚪";
    }
  };

  // Fixed styling - removed conditional opacity and added explicit colors
  const getCardStyles = (status) => {
    switch (status) {
      case "running":
        return "bg-blue-50 border-blue-300 border-2";
      case "success":
        return "bg-green-50 border-green-300 border-2";
      case "error":
        return "bg-red-50 border-red-300 border-2";
      default:
        return "bg-white border-gray-300 border-2";
    }
  };

  const getTextColor = (status) => {
    switch (status) {
      case "running":
        return "text-blue-900";
      case "success":
        return "text-green-900";
      case "error":
        return "text-red-900";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                API Testing Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Test your backend API connectivity and endpoints
              </p>
            </div>
            <div className="text-sm text-gray-700">
              Backend URL:{" "}
              <code className="bg-gray-200 px-2 py-1 rounded text-gray-800 font-mono">
                {import.meta.env.VITE_API_BASE_URL || "Not configured"}
              </code>
            </div>
          </div>

          {/* Credentials Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
              🔐 Test Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter test email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter test password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {loading ? "🔄" : "🚀"}{" "}
              {loading ? "Running Tests..." : "Run Comprehensive Tests"}
            </button>
            <button
              onClick={() => setTestResults({})}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              🗑️ Clear Results
            </button>
            <button
              onClick={() =>
                window.open(
                  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") +
                    "/health" || "http://localhost:5000/health",
                  "_blank"
                )
              }
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              🌐 Open Backend Health Check
            </button>
          </div>

          {/* Test Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tests.map((test) => {
              const result = testResults[test.name];
              const status = result?.status || "idle";

              return (
                <div
                  key={test.name}
                  className={`rounded-lg p-6 ${getCardStyles(status)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold flex items-center gap-3 ${getTextColor(
                          status
                        )}`}
                      >
                        <span className="text-2xl">
                          {getStatusIcon(status)}
                        </span>
                        {test.label}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${getTextColor(
                          status
                        )} opacity-80`}
                      >
                        {test.description}
                      </p>
                      {result?.timestamp && (
                        <p
                          className={`text-xs mt-2 ${getTextColor(
                            status
                          )} opacity-70`}
                        >
                          Last run: {result.timestamp.toLocaleTimeString()}
                          {result.duration && ` (${result.duration}ms)`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => runTest(test.name, test.fn)}
                      disabled={loading}
                      className="px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 disabled:opacity-50 text-sm font-medium border border-gray-300 shadow-sm"
                    >
                      Test
                    </button>
                  </div>

                  {result && result.result && (
                    <div className="mt-4 bg-white rounded-md p-4 border border-gray-200">
                      <div className="text-sm font-medium mb-2 text-gray-700">
                        Result:
                      </div>
                      <div className="bg-gray-900 rounded p-3 overflow-x-auto max-h-60">
                        <pre className="text-xs text-green-400 whitespace-pre-wrap">
                          {typeof result.result === "object"
                            ? JSON.stringify(result.result, null, 2)
                            : result.result}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Summary */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📊 Test Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl">⚪</div>
                  <div className="text-gray-700">Total Tests</div>
                  <div className="font-bold text-gray-900">{tests.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">✅</div>
                  <div className="text-gray-700">Passed</div>
                  <div className="font-bold text-green-600">
                    {
                      Object.values(testResults).filter(
                        (r) => r.status === "success"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">❌</div>
                  <div className="text-gray-700">Failed</div>
                  <div className="font-bold text-red-600">
                    {
                      Object.values(testResults).filter(
                        (r) => r.status === "error"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">🔄</div>
                  <div className="text-gray-700">Running</div>
                  <div className="font-bold text-blue-600">
                    {
                      Object.values(testResults).filter(
                        (r) => r.status === "running"
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              📝 Instructions
            </h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>
                • Make sure your backend server is running on the configured URL
              </li>
              <li>
                • Update credentials above to match your backend test accounts
              </li>
              <li>• Check browser console for detailed logs during testing</li>
              <li>• Green tests indicate successful API communication</li>
              <li>
                • Red tests show specific error messages to help debug issues
              </li>
            </ul>
          </div>

          {/* Debug Info */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <details className="text-sm">
              <summary className="font-medium text-gray-700 cursor-pointer">
                🔍 Debug Information
              </summary>
              <div className="mt-3 space-y-2 text-gray-600">
                <div>
                  Environment:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    {import.meta.env.MODE}
                  </code>
                </div>
                <div>
                  API Base URL:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    {import.meta.env.VITE_API_BASE_URL || "Not set"}
                  </code>
                </div>
                <div>
                  Test Results Count:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    {Object.keys(testResults).length}
                  </code>
                </div>
                <div>
                  Loading State:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    {loading ? "true" : "false"}
                  </code>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
