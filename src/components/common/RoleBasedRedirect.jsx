import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RoleBasedRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  const redirectPath = user?.is_superuser ? "/admin/dashboard" : "/pos";

  console.log("🎯 Role-based redirect:", {
    userId: user?.id,
    username: user?.username,
    isSuperuser: user?.is_superuser,
    redirectTo: redirectPath,
  });

  return <Navigate to={redirectPath} replace />;
};

export default RoleBasedRedirect;
