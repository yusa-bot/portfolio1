"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

export type Toast = {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
};

const ToastContext = createContext<{
  addToast: (toast: Omit<Toast, 'id'>) => void;
} | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within Toaster');
  return ctx;
};

export const Toaster: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow text-white text-sm animate-fade-in-up ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                ? 'bg-red-500'
                : 'bg-slate-700'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
