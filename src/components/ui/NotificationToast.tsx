"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
  X,
} from "lucide-react";
import { useNotification, Notification } from "@/context/NotificationContext";

const icons = {
  success: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
  error: <XCircle className="w-6 h-6 text-red-500" />,
  warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
  critical: <ShieldAlert className="w-6 h-6 text-red-800 animate-pulse" />,
};

const containerStyles = {
  success: "border-emerald-200 bg-white/80 shadow-emerald-900/5",
  error: "border-red-200 bg-white/80 shadow-red-900/5",
  warning: "border-amber-200 bg-white/80 shadow-amber-900/5",
  info: "border-blue-200 bg-white/80 shadow-blue-900/5",
  critical: "border-red-500 bg-red-50/90 shadow-red-900/20",
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-md p-4 shadow-lg pr-10 ${containerStyles[notification.type]}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">{icons[notification.type]}</div>
        <div className="flex-1">
          {notification.title && (
            <h4
              className={`text-sm font-bold mb-1 ${notification.type === "critical" ? "text-red-900" : "text-slate-900"}`}
            >
              {notification.title}
            </h4>
          )}
          <p
            className={`text-sm leading-relaxed ${notification.type === "critical" ? "text-red-800" : "text-slate-600"}`}
          >
            {notification.message}
          </p>
          {notification.action && (
            <button
              type="button"
              onClick={() => {
                notification.action?.onClick();
                onClose();
              }}
              className={`mt-3 px-4 py-2 text-xs font-bold rounded-lg border shadow-sm transition-all
                                ${
                                  notification.type === "critical" ||
                                  notification.type === "error"
                                    ? "bg-red-600 text-white border-red-700 hover:bg-red-700"
                                    : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                                }
                            `}
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar visual for auto-dismiss (optional flair) */}
      {notification.type !== "critical" && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-1 opacity-20 ${
            notification.type === "success"
              ? "bg-emerald-500"
              : notification.type === "error"
                ? "bg-red-500"
                : notification.type === "warning"
                  ? "bg-amber-500"
                  : "bg-blue-500"
          }`}
        />
      )}
    </motion.div>
  );
};
