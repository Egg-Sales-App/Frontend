import { Bell } from "lucide-react";
import React from "react";
import { useSidebar } from "../context/SidebarContext";

const Navbar = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`fixed top-0 right-0 z-20 navbar shadow-sm px-4 h-[64px] bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[calc(100%-64px)]" : "w-[calc(100%-208px)]"
      }`}
    >
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {/* Left - Search Bar */}
        <div className="relative flex-1 flex justify-left">
          <div className="flex w-full max-w-md">
            <div className="w-full bg-gray-50">
              {/* Search Input */}
              <label className="input w-full bg-gray-200 text-gray-950">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input
                  type="search"
                  className="grow"
                  placeholder="Search product, supplier, order"
                />
              </label>
            </div>
          </div>
        </div>

        {/* End - Notification & Profile */}
        <div className="flex gap-4 items-center">
          {/* Notification Icon */}
          <div className="indicator">
            <Bell className="text-gray-500" />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>

          {/* Profile Avatar */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
