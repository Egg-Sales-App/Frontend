import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ToastContainer from "./components/ui/ToastContainer"; // ✅ ADD THIS
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./components/ui/ToastContext"; // ✅ ADD THIS
import SignupForm from "./pages/SignUpForm";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/admin/Dashboard";
import Employee from "./pages/admin/Employee";
import Inventory from "./pages/admin/Inventory";
import Sales from "./pages/admin/Sales";
import ManageStore from "./pages/admin/ManageStore";
import Supplier from "./pages/admin/Supplier";
import Reports from "./pages/admin/Reports";
import ApiTestPage from "./pages/ApiTestPage";
import { SidebarProvider } from "./context/SidebarContext";
import AdminLayout from "./components/layout/AdminLayout";
import POSLayout from "./components/layout/POSLayout";
import POSSales from "./pages/pos/equipments-store/Sales";
import POSInventory from "./pages/pos/equipments-store/Inventory";
import POSReports from "./pages/pos/equipments-store/Reports";
import POSDashboard from "./pages/pos/equipments-store/Dashboard";
import { Navigate } from "react-router-dom";




function App() {
   return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <SidebarProvider>
            <Router>
              <Routes>

                {/* Dev-only route */}
                {import.meta.env.MODE === "development" && (
                  <Route path="/api-test" element={<ApiTestPage />} />
                )}

                {/* Public Routes */}
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                              
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />


                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="suppliers" element={<Supplier />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="manage-store" element={<ManageStore />} />
                  <Route path="employees" element={<Employee />} />
                </Route>

                {/* POS Base Redirect */}
               <Route path="/pos" element={<Navigate to="/pos/equipment/dashboard" replace />} />

                {/* POS - Equipment Store */}
                <Route path="/pos/equipment"  element={<POSLayout />}>
                  <Route path="dashboard" element={<POSDashboard />} />
                  <Route path="inventory" element={<POSInventory />} />
                  <Route path="sales" element={<POSSales />} />
                  <Route path="reports" element={<POSReports />} />
                </Route>

                {/* POS - Feeds and Eggs Store */}
                <Route path="/pos/feeds" element={<POSLayout />}>
                  <Route path="dashboard" element={<POSDashboard />} />
                  <Route path="inventory" element={<POSInventory />} />
                  <Route path="sales" element={<POSSales />} />
                  <Route path="reports" element={<POSReports />} />
                </Route>

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