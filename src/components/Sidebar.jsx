import React from "react";
import { Link, useLocation } from "react-router-dom";

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
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/" },
    { icon: <Boxes size={18} />, label: "Inventory", path: "/inventory" },
    { icon: <FileText size={18} />, label: "Reports", path: "/reports" },
    { icon: <Truck size={18} />, label: "Suppliers", path: "/suppliers" },
    { icon: <ShoppingCart size={18} />, label: "Sales", path: "/sales" },
    { icon: <Store size={18} />, label: "Manage Store", path: "/manage-store" },
    { icon: <Users size={18} />, label: "Employees", path: "/employees" },
  ];

  const footerItems = [
    { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
    { icon: <LogOut size={18} />, label: "Logout", path: "/login" },
  ];

  // Function to check if current path is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Function to get link classes based on active state
  const getLinkClasses = (path) => {
    const baseClasses =
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200";

    if (isActive(path)) {
      return `${baseClasses} bg-blue-50 text-blue-500 font-semibold border-r-2 border-blue-500`;
    }

    return `${baseClasses} text-gray-700 hover:bg-gray-100 hover:text-blue-600`;
  };

  return (
    <aside className="fixed top-0 left-0 z-20 w-[200px] h-screen bg-white p-6 pt-10 shadow flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="flex justify-center mb-8">
          <div className="bg-[#f4faf8] px-6 py-3 rounded-md text-[#496961] font-black font-[Lato] text-lg text-center hover:text-blue-600">
            LOGO
          </div>
        </div>

        {/* Menu Items */}
        <ul className="space-y-2 text-sm font-medium">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className={getLinkClasses(item.path)}>
                <span className={isActive(item.path) ? "text-blue-500" : ""}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Items */}
      <ul className="space-y-2 text-sm font-medium mt-6">
        {footerItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className={getLinkClasses(item.path)}>
              <span className={isActive(item.path) ? "text-blue-500" : ""}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
