"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastType = "success" | "error" | "info";
type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

const ToastContext = createContext<{
  toast: (type: ToastType, message: string) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg animate-[slideUp_200ms_ease-out]",
              t.type === "error" ? "border-danger/30" : "border-border"
            )}
            role="status"
          >
            {t.type === "success" && (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-positive" />
            )}
            {t.type === "error" && (
              <AlertCircle className="h-5 w-5 shrink-0 text-danger" />
            )}
            {t.type === "info" && <Info className="h-5 w-5 shrink-0 text-black" />}
            <p className="flex-1 text-sm text-black">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-muted hover:text-black"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
