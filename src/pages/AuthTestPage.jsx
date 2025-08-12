import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const AuthTestPage = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [authDetails, setAuthDetails] = useState({
    token: null,
    refreshToken: null,
    userData: null,
  });

  useEffect(() => {
    // Get current auth details
    const token = authService.getAuthToken();
    const refreshToken = localStorage.getItem("refresh_token");
    const userData = localStorage.getItem("user_data");

    setAuthDetails({
      token: token ? `${token.substring(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      userData: userData ? JSON.parse(userData) : null,
    });
  }, [user]);

  const handleLogout = async () => {
    try {
      console.log("🚪 Testing logout from auth test page...");
      await logout();
      showToast("Logout completed successfully!", "success");
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout test failed:", error);
      showToast("Logout failed: " + error.message, "error");
    }
  };

  const handleRefreshToken = async () => {
    try {
      console.log("🔄 Testing token refresh...");
      const newToken = await authService.refreshToken();
      showToast("Token refreshed successfully!", "success");

      // Update displayed token
      setAuthDetails((prev) => ({
        ...prev,
        token: newToken ? `${newToken.substring(0, 20)}...` : null,
      }));
    } catch (error) {
      console.error("❌ Token refresh test failed:", error);
      showToast("Token refresh failed: " + error.message, "error");
    }
  };

  const handleGetCurrentUser = async () => {
    try {
      console.log("👤 Testing get current user...");
      const currentUser = await authService.getCurrentUser();
      showToast("User data fetched successfully!", "success");

      setAuthDetails((prev) => ({
        ...prev,
        userData: currentUser,
      }));
    } catch (error) {
      console.error("❌ Get current user test failed:", error);
      showToast("Get current user failed: " + error.message, "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Please log in to access the authentication test page.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            🔐 Authentication Test Page
          </h1>

          {/* Current User Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Current User Information
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">ID:</span> {user?.id}
                </div>
                <div>
                  <span className="font-medium">Username:</span>{" "}
                  {user?.username}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user?.email}
                </div>
                <div>
                  <span className="font-medium">Staff:</span>{" "}
                  {user?.is_staff ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>

          {/* Auth State */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Authenticated:</span>{" "}
                  <span
                    className={
                      isAuthenticated ? "text-green-600" : "text-red-600"
                    }
                  >
                    {isAuthenticated ? "✅ Yes" : "❌ No"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Loading:</span>{" "}
                  <span
                    className={isLoading ? "text-yellow-600" : "text-green-600"}
                  >
                    {isLoading ? "⏳ Yes" : "✅ No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Token Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Token Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Access Token:</span>{" "}
                  <code className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {authDetails.token || "None"}
                  </code>
                </div>
                <div>
                  <span className="font-medium">Refresh Token:</span>{" "}
                  <code className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {authDetails.refreshToken || "None"}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Stored User Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Stored User Data</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(authDetails.userData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Test Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleRefreshToken}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                🔄 Refresh Token
              </button>
              <button
                onClick={handleGetCurrentUser}
                className="btn btn-info"
                disabled={isLoading}
              >
                👤 Get Current User
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-error"
                disabled={isLoading}
              >
                🚪 Test Logout
              </button>
            </div>
          </div>

          {/* Console Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📊 Console Logging
            </h3>
            <p className="text-blue-700">
              Check your browser's console (F12) to see detailed logging of all
              authentication operations including backend responses, token
              management, and API calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
