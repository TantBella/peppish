import React, { createContext, useContext, useCallback, useState } from "react";

type ToastType = "info" | "success" | "error";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (msg: string, type?: ToastType, durationMs?: number | null) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      durationMs: number | null | undefined = undefined,
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((t) => [...t, { id, type, message }]);

      if (durationMs === null) return;
      const timeout =
        typeof durationMs === "number"
          ? durationMs
          : type === "error"
            ? null
            : 5000;
      if (timeout === null) return;
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
