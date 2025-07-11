import React from "react";
import Navbar from "../Navbar";
import PosSidebar from "../ui/PosSidebar";
import { useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router-dom";

const POSLayout = () => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PosSidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-52"
        }`}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-100 mt-16">
          <div className="max-w-full mx-auto">
            <Outlet /> {/* 👈 This renders the matched POS route page */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default POSLayout;
