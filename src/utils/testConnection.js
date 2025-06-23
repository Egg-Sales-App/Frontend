import { apiService } from "../services/api";

export const testBackendConnection = async () => {
  try {
    // Test basic connectivity
    const response = await apiService.get("/health");
    console.log("✅ Backend connection successful:", response);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
    return false;
  }
};

// Test specific endpoints
export const testEndpoints = async () => {
  const tests = [
    { name: "Health Check", endpoint: "/health" },
    { name: "Auth Check", endpoint: "/auth/check" },
    { name: "Products", endpoint: "/products?limit=1" },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const response = await apiService.get(test.endpoint);
      console.log(`✅ ${test.name}: OK`, response);
      results.push({ ...test, status: "success", response });
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      results.push({ ...test, status: "error", error: error.message });
    }
  }

  return results;
};

// Test authentication flow
export const testAuth = async (credentials) => {
  try {
    const response = await apiService.post("/auth/login", credentials);
    console.log("✅ Authentication test successful:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("❌ Authentication test failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Test data fetching
export const testDataFetch = async (endpoint, params = {}) => {
  try {
    const response = await apiService.get(endpoint, params);
    console.log(`✅ Data fetch test successful for ${endpoint}:`, response);
    return { success: true, data: response };
  } catch (error) {
    console.error(`❌ Data fetch test failed for ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Comprehensive test suite
export const runComprehensiveTests = async () => {
  console.log("🚀 Starting comprehensive API tests...\n");

  const testResults = {};

  // Test 1: Basic Connection
  console.log("1️⃣ Testing basic connection...");
  testResults.connection = await testBackendConnection();

  // Test 2: Endpoints
  console.log("\n2️⃣ Testing individual endpoints...");
  testResults.endpoints = await testEndpoints();

  // Test 3: Products endpoint (without auth)
  console.log("\n3️⃣ Testing products endpoint...");
  testResults.products = await testDataFetch("/products", { limit: 3 });

  // Test 4: Categories endpoint
  console.log("\n4️⃣ Testing categories endpoint...");
  testResults.categories = await testDataFetch("/products/categories");

  console.log("\n📊 Comprehensive Test Results:");
  console.table(testResults);

  return testResults;
};
