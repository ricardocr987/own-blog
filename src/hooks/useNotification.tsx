import { useState, useCallback } from "react";

interface Notification {
    id: number;
    text: string;
}

const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [nextId, setNextId] = useState(1);
  
    const addNotification = useCallback((text: string) => {
        setNotifications((notifications) => [
            ...notifications,
            { id: nextId, text },
        ]);
        setNextId((id) => id + 1);
    }, [nextId]);
  
    const removeNotification = useCallback((id: number) => {
        setNotifications((notifications) =>
            notifications.filter((notification) => notification.id !== id)
        );
    }, []);
  
    return { notifications, addNotification, removeNotification };
};

export default useNotification;
  