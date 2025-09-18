import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext"; // Custom hook for sidebar state/context
import { useAuth } from "../hooks/useAuth"; // Authentication hook
import { useToast } from "../hooks/useToast"; // Toast notifications
import {
  LayoutDashboard,
  Boxes,
  FileText,
  Truck,
  ShoppingCart,
  Store,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"; // Icon library

const Sidebar = () => {
  // Get sidebar state and toggle function from context
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

  // Get authentication functions from useAuth hook
  const { logout } = useAuth();

  // Navigation and toast hooks
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Icon size (can later be dynamic if needed)
  const iconSize = isCollapsed ? 20 : 20;

  // Handle user logout with feedback and redirection
  const handleLogout = async () => {
    try {
      // Call logout service through useAuth hook
      const result = await logout();

      // Show success message
      addToast("Logged out successfully", "success");

      // Redirect user to login page after logout
      navigate("/login", { replace: true });
    } catch (error) {
      // Show error toast if logout fails
      console.error("❌ Logout failed:", error);
      addToast(error.message || "Logout failed. Please try again.", "error");
    }
  };

  // Main navigation items
  const menuItems = [
    {
      icon: <LayoutDashboard size={iconSize} />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <Boxes size={iconSize} />,
      label: "Inventory",
      path: "/admin/inventory",
    },
    // {
    //   icon: <FileText size={iconSize} />,
    //   label: "Reports",
    //   path: "/admin/reports",
    // },
    {
      icon: <Truck size={iconSize} />,
      label: "Suppliers",
      path: "/admin/suppliers",
    },
    {
      icon: <ShoppingCart size={iconSize} />,
      label: "Sales",
      path: "/admin/sales",
    },
    {
      icon: <Store size={iconSize} />,
      label: "Manage Store",
      path: "/admin/manage-store",
    },
    {
      icon: <Users size={iconSize} />,
      label: "Employees",
      path: "/admin/employees",
    },
  ];

  // Footer items (settings + logout)
  const footerItems = [
    // {
    //   icon: <Settings size={iconSize} />,
    //   label: "Settings",
    //   path: "/admin/settings",
    // },
    {
      icon: <LogOut size={iconSize} color="white" />,
      label: "Logout",
      onClick: handleLogout, // Use click handler instead of path
    },
  ];

  // Function to dynamically style active vs inactive links
  const getLinkClasses = ({ isActive }) => {
    const base = `flex items-center gap-3 px-1 py-2 rounded-lg transition-all duration-200 ${
      isCollapsed ? "justify-center" : ""
    }`;

    return isActive
      ? `${base} bg-blue-50 text-blue-600 font-semibold ${
          !isCollapsed ? "border-r-2 border-blue-600" : ""
        }`
      : `${base} text-gray-700 hover:bg-gray-100 hover:text-blue-600`;
  };

  return (
    <>
      {/* Mobile overlay (dark background when sidebar is open) */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-20 h-screen bg-white shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-52"
        } ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* -------- Header Section -------- */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {!isCollapsed && (
              <div className="bg-blue-100 px-3 py-2 rounded-md text-blue-600 font-black text-base hover:text-blue-600">
                ADMIN
              </div>
            )}

            {/* Collapse/Expand button */}
            <button
              onClick={toggleSidebar}
              className={`p-1 rounded-lg bg-gray-300 hover:bg-blue-500 transition-colors ${
                isCollapsed ? "mx-auto" : ""
              }`}
            >
              {isCollapsed ? (
                <Menu size={20} color="#496961" />
              ) : (
                <X size={18} />
              )}
            </button>
          </div>

          {/* -------- Main Menu -------- */}
          <ul className="space-y-2 text-sm font-medium">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.path}
                  className={getLinkClasses}
                  title={isCollapsed ? item.label : ""} // Tooltip when collapsed
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* -------- Footer Menu -------- */}
        <div className="p-4">
          <ul className="space-y-2 text-sm font-medium bg-blue-600 rounded-md">
            {footerItems.map((item, idx) => (
              <li key={idx}>
                {item.onClick ? (
                  // Handle logout with click handler
                  <button
                    onClick={item.onClick}
                    className={`flex items-center gap-3 px-1 py-2 rounded-lg transition-all duration-200 text-white hover:bg-blue-700 w-full ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                ) : (
                  // Handle navigation with NavLink
                  <NavLink
                    to={item.path}
                    className={`flex items-center gap-3 px-1 py-2 rounded-lg transition-all duration-200 text-white hover:bg-red-700 ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Floating toggle button (only visible on mobile when collapsed) */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
