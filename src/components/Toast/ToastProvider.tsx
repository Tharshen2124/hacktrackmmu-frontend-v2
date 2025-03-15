import type React from "react";
import { createContext, useState, useCallback, useContext } from "react";
import Toast, { type ToastType } from "./index";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: ToastType }>
  >([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  }, []);

  const closeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => closeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
