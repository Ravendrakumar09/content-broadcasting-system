"use client";

import { useEffect } from "react";

const styleByType = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

export default function ToastStack({ toasts, onDismiss }) {
  useEffect(() => {
    if (!toasts?.length) {
      return;
    }

    const timers = toasts.map((toast) =>
      setTimeout(() => onDismiss(toast.id), 3500)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, onDismiss]);

  if (!toasts?.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-4 py-3 text-sm shadow-sm ${
            styleByType[toast.type] || styleByType.info
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
