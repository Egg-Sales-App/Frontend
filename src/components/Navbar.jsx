import { Bell, LogOut, User, Settings } from "lucide-react"; // Icons
import React from "react";
import { useSidebar } from "../context/SidebarContext"; // Access sidebar state
import { useAuth } from "../hooks/useAuth"; // Authentication hook (user + logout)
import { useNavigate } from "react-router-dom"; // For programmatic navigation
import { useToast } from "../hooks/useToast"; // Toast notifications

const Navbar = () => {
  // Access sidebar state to dynamically adjust navbar width
  const { isCollapsed } = useSidebar();

  // Get user info, logout function, and loading state from auth context
  const { user, logout, isLoading } = useAuth();

  // React Router navigation
  const navigate = useNavigate();

  // Toast context for showing messages
  const { addToast } = useToast();

  // Handle user logout with feedback and redirection
  const handleLogout = async () => {
    try {
      // Call logout service
      const result = await logout();

      // Redirect user to login page after logout
      navigate("/login", { replace: true });
    } catch (error) {
      // Show error toast if logout fails
      console.error("❌ Logout failed:", error);
      addToast(error.message || "Logout failed. Please try again.", "error");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 z-20 navbar shadow-sm px-4 h-[64px] bg-white transition-all duration-300 ease-in-out ${
        // Adjust navbar width based on whether sidebar is collapsed
        isCollapsed ? "w-[calc(100%-64px)]" : "w-[calc(100%-208px)]"
      }`}
    >
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {/* LEFT SECTION - Search Bar */}
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

        {/* RIGHT SECTION - Notifications & Profile Menu */}
        <div className="flex gap-4 items-center">
          {/* Notification Bell Icon */}
          {/* <div className="indicator">
            <Bell className="text-gray-500" />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div> */}

          {/* Welcome Message */}
          <div className="indicator">
            <span className="text-gray-700 font-bold">Welcome back,</span>{" "}
            <span className="font-semibold text-gray-800 ml-1">
              {user?.username || "User"}!
            </span>
          </div>

          {/* Profile Avatar & Dropdown Menu */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {/* Static avatar image (can be replaced with user avatar) */}
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            {/* Dropdown menu with user info and actions */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              {/* Show user info if available */}
              {user && (
                <li className="menu-title px-4 py-2">
                  <div className="text-sm">
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                </li>
              )}

          

              <div className="divider my-1"></div>

              {/* Logout Button */}
              <li>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-red-600 hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} />
                    {isLoading ? "Logging out..." : "Logout"}
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
