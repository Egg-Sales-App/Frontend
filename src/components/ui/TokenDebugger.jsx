import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";

/**
 * TokenDebugger Component
 * -----------------------
 * A developer-facing utility panel that helps visualize:
 *  - Current authentication state
 *  - User info from the auth context
 *  - JWT token details (expiration, status, etc.)
 *  - Local storage contents related to authentication
 *
 * Provides actions to:
 *  - Refresh tokens manually
 *  - Update token info on-demand
 *  - Logout the user
 *
 * This is primarily meant for debugging / development environments.
 */
const TokenDebugger = () => {
  // Local state for token details
  const [tokenInfo, setTokenInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Auth context values
  const { user, isAuthenticated, logout } = useAuth();

  // Toast notifications
  const { success, error: showError } = useToast();

  // Router navigation
  const navigate = useNavigate();

  /**
   * Updates the tokenInfo state with the latest token data
   * retrieved from the authService.
   */
  const updateTokenInfo = () => {
    const info = authService.getTokenInfo();
    setTokenInfo(info);
  };

  // On mount: update token info immediately and set up a 10s interval
  useEffect(() => {
    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 10000); // Refresh every 10s
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  /**
   * Manually refreshes the auth token using authService.
   * Displays success/error messages via toast notifications.
   */
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

  /**
   * Logs out the user using the auth context logout method.
   * On success, navigates to the login page.
   */
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

  // If user is not authenticated, show a warning card
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

      {/* ====================== User Info ====================== */}
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

      {/* ====================== Token Info ====================== */}
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

      {/* ====================== Action Buttons ====================== */}
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

      {/* ====================== Local Storage Debug Info ====================== */}
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
