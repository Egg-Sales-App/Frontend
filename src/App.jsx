import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleBasedRedirect from "./components/common/RoleBasedRedirect";
import ToastContainer from "./components/ui/ToastContainer";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./components/ui/ToastContext";
import SignupForm from "./pages/SignUpForm";
import LoginForm from "./pages/LoginForm";
import SetEmployeePassword from "./pages/SetEmployeePassword";
import Dashboard from "./pages/admin/Dashboard";
import Employee from "./pages/admin/Employee";
import Inventory from "./pages/admin/Inventory";
import Sales from "./pages/admin/Sales";
import ManageStore from "./pages/admin/ManageStore";
import Supplier from "./pages/admin/Supplier";
import Reports from "./pages/admin/Reports";
import ApiTestPage from "./pages/ApiTestPage";
import ApiIntegrationTest from "./pages/ApiIntegrationTest";
import AuthTestPage from "./pages/AuthTestPage";
import { SidebarProvider } from "./context/SidebarContext";
import AdminLayout from "./components/layout/AdminLayout";
import POSLayout from "./components/layout/POSLayout";
import POSEquipmentsSales from "./pages/pos/Sales";
import POSInventory from "./pages/pos/Inventory";

import { Navigate } from "react-router-dom";
import SupplierDetails from "./pages/admin/SupplierDetails";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <SidebarProvider>
            <Router>
              <Routes>
                {/* Dev-only route - Protected for testing with real backend */}
                {import.meta.env.MODE === "development" && (
                  <Route
                    path="/api-test"
                    element={
                      <ProtectedRoute>
                        <ApiTestPage />
                      </ProtectedRoute>
                    }
                  />
                )}

                {/* Comprehensive API    { icon: <LogOut size={20} />, label: "Logout", path: "/login" },
 Integration Test */}
                {import.meta.env.MODE === "development" && (
                  <Route
                    path="/integration-test"
                    element={
                      <ProtectedRoute>
                        <ApiIntegrationTest />
                      </ProtectedRoute>
                    }
                  />
                )}

                {/* Authentication Test Page */}
                {import.meta.env.MODE === "development" && (
                  <Route
                    path="/auth-test"
                    element={
                      <ProtectedRoute>
                        <AuthTestPage />
                      </ProtectedRoute>
                    }
                  />
                )}

                {/* Public Routes */}
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/set-employee-password" element={<SetEmployeePassword />} />

                {/* Default Route - Role-based redirect */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <RoleBasedRedirect />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes - Protected and require admin role */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="suppliers" element={<Supplier />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="manage-store" element={<ManageStore />} />
                  <Route path="employees" element={<Employee />} />
                </Route>

                {/* POS- Protected */}
                <Route
                  path="/pos"
                  element={
                    <ProtectedRoute>
                      <POSLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    path="inventory"
                    element={<POSInventory />}
                  />
                  <Route path="sales" element={<POSSales />} />
                </Route>

                {/* Supplier Details - Protected and require admin role */}
                <Route
                  path="/admin/suppliers/:supplierId"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <SupplierDetails />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route - redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
              <ToastContainer />
            </Router>
          </SidebarProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
