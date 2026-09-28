import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext(null);

let toastCount = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = `toast-${Date.now()}-${++toastCount}`;
    const newToast = {
      id,
      message,
      type,
      title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Notice' : 'Information'),
      duration,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = useMemo(() => {
    const fn = (message, type = 'info', title = '', duration = 4000) => addToast(message, type, title, duration);
    fn.success = (message, title = 'Success', duration = 4000) => addToast(message, 'success', title, duration);
    fn.error = (message, title = 'Error', duration = 5000) => addToast(message, 'error', title, duration);
    fn.info = (message, title = 'Information', duration = 4000) => addToast(message, 'info', title, duration);
    fn.warning = (message, title = 'Notice', duration = 4500) => addToast(message, 'warning', title, duration);
    return fn;
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
