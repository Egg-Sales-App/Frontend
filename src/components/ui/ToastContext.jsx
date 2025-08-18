import React, { useState, useCallback, createContext, useContext } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

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
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
