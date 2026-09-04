import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(() => {
    try {
      const saved = sessionStorage.getItem("cf_flash_toast");
      if (saved) {
        sessionStorage.removeItem("cf_flash_toast");
        return JSON.parse(saved);
      }
    } catch {}
    return null;
  });

  const showToast = useCallback((message, type = "success", title = null, duration = 3500) => {
    try {
      sessionStorage.removeItem("cf_flash_toast");
    } catch {}
    setToast({ message, type, title, duration });
  }, []);

  const flashToast = useCallback((message, type = "success", title = null, duration = 3500) => {
    try {
      sessionStorage.setItem("cf_flash_toast", JSON.stringify({ message, type, title, duration }));
    } catch {}
    setToast({ message, type, title, duration });
  }, []);

  const hideToast = useCallback(() => {
    try {
      sessionStorage.removeItem("cf_flash_toast");
    } catch {}
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, flashToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          title={toast.title}
          duration={toast.duration || 3500}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

