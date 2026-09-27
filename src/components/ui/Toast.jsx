/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToast({ id, message });
    window.setTimeout(() => setToast((current) => (current?.id === id ? null : current)), 2600);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 animate-[fadeIn_0.18s_ease-out]">
          <div className="bg-navy-950 text-white border border-navy-800 rounded-sm px-3 py-2 text-sm shadow-lg">
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
