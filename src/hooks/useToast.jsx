import { useState, useCallback } from "react";

/**
 * Custom hook for managing toast notifications.
 * - Provides functions to show and remove notifications.
 * - Supports different types: success, error, warning, info.
 * - Each toast automatically disappears after a given duration.
 */
export const useToast = () => {
  // Array of active toast notifications
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast notification.
   * @param {string} message - The notification text.
   * @param {string} type - Type of toast: "info", "success", "error", "warning".
   * @param {number} duration - Time (ms) before the toast auto-dismisses.
   */
  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now(); // Unique ID for this toast
    const toast = { id, message, type, duration };

    // Add the new toast to the list
    setToasts((prev) => [...prev, toast]);

    // Auto-remove toast after `duration` milliseconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  /**
   * Manually remove a toast by ID.
   * Useful when user clicks "close" on a notification.
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 🔹 Helper functions for specific toast types
  const success = useCallback(
    (message, duration) => {
      addToast(message, "success", duration);
    },
    [addToast]
  );

  const error = useCallback(
    (message, duration) => {
      addToast(message, "error", duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (message, duration) => {
      addToast(message, "warning", duration);
    },
    [addToast]
  );

  const info = useCallback(
    (message, duration) => {
      addToast(message, "info", duration);
    },
    [addToast]
  );

  // Return everything a component needs to use the toast system
  return {
    toasts,     // current list of active toasts
    addToast,   // generic add function
    removeToast,// manual remove
    success,    // shortcut: success toast
    error,      // shortcut: error toast
    warning,    // shortcut: warning toast
    info,       // shortcut: info toast
  };
};
