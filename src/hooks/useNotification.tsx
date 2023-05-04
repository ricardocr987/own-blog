import { useState } from "react";
import { NotificationType } from "@/types";
import { Notification } from '@/types';

const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [nextId, setNextId] = useState(1);
  
    const addNotification = (text: string, type: NotificationType) => {
        const existingNotification = notifications.find(
            (notification) => notification.text === text && notification.type === type
        );
        if (existingNotification) {
            return;
        }

        setNotifications((notifications) => [
            ...notifications,
            { id: nextId, text, type },
        ]);
        setNextId((id) => id + 1);
    };
  
    const removeNotification = (id: number) => {
        setNotifications((notifications) =>
            notifications.filter((notification) => notification.id !== id)
        );
    };
  
    return { notifications, addNotification, removeNotification };
};

export default useNotification;
  