"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "critical";

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    action?: { label: string; onClick: () => void },
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      action?: { label: string; onClick: () => void },
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [
        ...prev,
        { id, type, title, message, action },
      ]);

      // Auto remove logic
      // If there is an action, we might want to give the user more time or not dismiss it at all
      // For now, let's say "critical" or notifications with actions don't auto-dismiss quickly.
      const duration = type === "critical" || action ? 0 : 5000;

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
