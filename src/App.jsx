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

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Add this route for development */}
              {import.meta.env.MODE === "development" && (
                <Route path="/api-test" element={<ApiTestPage />} />
              )}

              <Route path="/signup" element={<SignupForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/"
                element={
                  <Dashboard />
                  // <ProtectedRoute>
                  //   <Dashboard />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <Inventory />
                  // <ProtectedRoute>
                  //   <Inventory />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <Reports />
                  // <ProtectedRoute>
                  //   <Reports />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <Supplier />
                  // <ProtectedRoute>
                  //   <Supplier />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <Sales />
                  // <ProtectedRoute>
                  //   <Sales />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/manage-store"
                element={
                  <ManageStore />
                  // <ProtectedRoute>
                  //   <ManageStore />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <Employee />
                  // <ProtectedRoute>
                  //   <Employee />
                  // </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
