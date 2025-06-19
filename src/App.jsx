import React from "react";
import SignupForm from "./pages/SignUpForm";
import LoginForm from './pages/LoginForm'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import Employee from "./pages/admin/Employee";
import Inventory from "./pages/admin/Inventory";
import Sales from "./pages/admin/Sales";
import ManageStore from "./pages/admin/ManageStore";
import Supplier from "./pages/admin/Supplier";
import Reports from "./pages/admin/Reports";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/suppliers" element={<Supplier />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/manage-store" element={<ManageStore />} />
        <Route path="/employees" element={<Employee />} />
      </Routes>
    </Router>
  );
}

export default App;