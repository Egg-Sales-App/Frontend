import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";

const TokenDebugger = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const updateTokenInfo = () => {
    const info = authService.getTokenInfo();
    setTokenInfo(info);
  };

  useEffect(() => {
    updateTokenInfo();
    // Update every 10 seconds
    const interval = setInterval(updateTokenInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshToken = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Manual token refresh initiated...");
      await authService.refreshToken();
      updateTokenInfo();
      console.log("✅ Manual token refresh successful");
      success("Token refreshed successfully");
    } catch (error) {
      console.error("❌ Manual token refresh failed:", error);
      showError(error.message || "Token refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 TokenDebugger logout initiated...");
      const result = await logout();

      success(result.message || "Logged out successfully");
      console.log("🎉 Logout successful from TokenDebugger");

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("❌ TokenDebugger logout error:", error);
      showError(error.message || "Logout failed. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card bg-yellow-50 border border-yellow-200 p-4 m-4">
        <h3 className="font-bold text-yellow-800">🔓 Not Authenticated</h3>
        <p className="text-yellow-700">No valid authentication token found.</p>
      </div>
    );
  }

  return (
    <div className="card bg-blue-50 border border-blue-200 p-4 m-4">
      <h3 className="font-bold text-blue-800 mb-3">🔍 Token Debugger</h3>

      {/* User Info */}
      {user && (
        <div className="mb-4 p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800">👤 User Info</h4>
          <div className="text-sm text-gray-600">
            <div>ID: {user.id}</div>
            <div>Username: {user.username}</div>
            <div>Email: {user.email}</div>
            <div>Staff: {user.is_staff ? "Yes" : "No"}</div>
          </div>
        </div>
      )}

      {/* Token Info */}
      {tokenInfo && (
        <div className="mb-4 p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800">🎫 Token Info</h4>
          <div className="text-sm text-gray-600">
            <div>User ID: {tokenInfo.userId}</div>
            <div>
              Expires At: {new Date(tokenInfo.expiresAt).toLocaleString()}
            </div>
            <div>Expires In: {Math.max(0, tokenInfo.expiresIn)} seconds</div>
            <div
              className={`font-semibold ${
                tokenInfo.isExpired ? "text-red-600" : "text-green-600"
              }`}
            >
              Status: {tokenInfo.isExpired ? "❌ EXPIRED" : "✅ VALID"}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleRefreshToken}
          disabled={refreshing}
          className="btn btn-sm btn-primary"
        >
          {refreshing ? "🔄 Refreshing..." : "🔄 Refresh Token"}
        </button>

        <button onClick={updateTokenInfo} className="btn btn-sm btn-secondary">
          🔍 Update Info
        </button>

        <button onClick={handleLogout} className="btn btn-sm btn-error">
          🚪 Logout
        </button>
      </div>

      {/* Storage Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded border text-xs">
        <div>
          Auth Token: {authService.getAuthToken() ? "✅ Present" : "❌ Missing"}
        </div>
        <div>
          Refresh Token:{" "}
          {localStorage.getItem("refresh_token") ? "✅ Present" : "❌ Missing"}
        </div>
        <div>
          User Data:{" "}
          {localStorage.getItem("user_data") ? "✅ Present" : "❌ Missing"}
        </div>
      </div>
    </div>
  );
};

export default TokenDebugger;
