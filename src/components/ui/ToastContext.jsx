import React, { useState, useCallback, createContext, useContext } from "react";

// Create a Context for the toast system
const ToastContext = createContext();

/**
 * useToast Hook
 * ----------------
 * Custom hook to access the toast context in child components.
 * Ensures that the hook can only be used within a ToastProvider.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * ToastProvider Component
 * ------------------------
 * Provides toast-related state and functions (add, remove, etc.)
 * to all children components wrapped in this provider.
 *
 * Props:
 * - children: ReactNode (any child components that need access to the toast system)
 */
export const ToastProvider = ({ children }) => {
  // State to keep track of all active toasts
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast
   * @param {string} message - The toast message
   * @param {string} type - The type of toast: "success" | "error" | "warning" | "info"
   * @param {number} duration - How long the toast should stay visible (ms)
   */
  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now(); // Unique ID based on timestamp
    const toast = { id, message, type, duration };

    // Add new toast to state
    setToasts((prev) => [...prev, toast]);

    // Automatically remove after duration expires
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  /**
   * Remove a toast manually by its ID
   */
  const removeToast = useCallback(
    (id) => {
      console.log("🗑️ ToastContext: Removing toast with ID:", id);
      console.log(
        "🗑️ Current toasts before removal:",
        toasts.map((t) => ({ id: t.id, message: t.message }))
      );

      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        console.log(
          "🗑️ Toasts after removal:",
          filtered.map((t) => ({ id: t.id, message: t.message }))
        );
        return filtered;
      });
    },
    [toasts]
  );

  /**
   * Shortcut methods for different toast types
   * (These wrap around addToast for convenience)
   */
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

  // Context value passed to children
  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
