// Import necessary dependencies
import { NotificationType } from "@/types";
import React, { createContext, useState } from "react";
import { Notification } from '@/types';
import { v4 as uuid } from 'uuid'

// Define the NotificationContext type
type NotificationContextType = {
  notifications: Notification[];
  addNotification: (text: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
};

// Create the NotificationContext
export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

// Create the NotificationProvider component
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (text: string, type: NotificationType) => {
    const existingNotification = notifications.find(
        (notification) => notification.text === text && notification.type === type
    );
    if (existingNotification) {
        return;
    }

    setNotifications((notifications) => [
        ...notifications,
        { id: uuid(), text, type },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((notifications) =>
        notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};