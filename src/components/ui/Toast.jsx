import React from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

/**
 * Toast Component
 * ----------------
 * Renders a notification (toast) with different styles and icons
 * depending on the notification type: success, error, warning, or info.
 *
 * Props:
 *  - toast: { id: string|number, type: string, message: string }
 *      Represents the toast data to render.
 *      type can be: "success" | "error" | "warning" | "info" (default).
 *  - onRemove: (id) => void
 *      Callback function to remove the toast by its ID.
 */
const Toast = ({ toast, onRemove }) => {
  /**
   * Handles closing the toast by invoking the onRemove callback.
   */
  const handleClose = () => {
    console.log("🗑️ Closing toast with ID:", toast.id);
    onRemove(toast.id);
  };

  /**
   * Returns the appropriate icon based on the toast type.
   */
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "warning":
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  /**
   * Returns Tailwind utility classes to style
   * the toast background, border, and text color
   * based on the toast type.
   */
  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={`flex items-center p-4 rounded-lg border shadow-sm ${getStyles()}`}
    >
      {/* Notification Icon */}
      {getIcon()}

      {/* Notification Message */}
      <span className="ml-3 flex-1">{toast.message}</span>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 p-1 rounded transition-colors duration-200"
        aria-label="Close notification"
        type="button"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
