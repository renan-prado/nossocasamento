"use client";

import { useEffect } from "react";
import { useToastStore } from "@/store/toast-store";

const baseToastClasses =
  "min-w-[260px] max-w-md rounded-full px-5 py-3 text-sm font-medium shadow-lg border flex items-center justify-center";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    if (!toasts.length) {
      return;
    }
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        removeToast(toast.id);
      }, 4000),
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-100 flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => {
        const typeClasses =
          toast.type === "success"
            ? "bg-green-600 text-white border-green-700"
            : toast.type === "error"
              ? "bg-red-600 text-white border-red-700"
              : "bg-neutral-900 text-white border-neutral-900";
        return (
          <div
            key={toast.id}
            className={`${baseToastClasses} ${typeClasses}`}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}

