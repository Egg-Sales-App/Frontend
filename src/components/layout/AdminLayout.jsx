import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminLayout = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Listen for screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle sidebar toggle from child components
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        onToggle={handleSidebarToggle}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-52"
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Main Content - Add proper top margin to avoid overlap */}
        <main className="flex-1 p-4 md:p-6 bg-gray-100 mt-16">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
