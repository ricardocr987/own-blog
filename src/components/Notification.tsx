import React, { useState, useEffect, memo } from 'react';

interface NotificationProps {
    text: string;
    removeNotification: (id: number) => void;
    id: number
}

const Notification = ({ text, removeNotification, id }: NotificationProps) => {
    return (
        <div className="fixed top-10 right-4 bg-red-400 p-4 rounded-md shadow-md cursor-pointer">
            <div
              className="absolute top-0 left-0 mt-5 ml-2 cursor-pointer"
              onClick={() => removeNotification(id)}
            >
                <svg id="Layer_1" version="1.1" viewBox="0 0 512 512" width="15px" xmlns="http://www.w3.org/2000/svg"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>
            </div>
            <div className='ml-2'>
            {text}
            </div>
        </div>
    );
};

interface NotificationType {
    id: number;
    text: string;
}

interface NotificationContainerProps {
    notifications: NotificationType[];
    removeNotification: (id: number) => void;
}

const NotificationContainer = ({ notifications, removeNotification }: NotificationContainerProps) => {  
  const [displayedNotifications, setDisplayedNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (notifications.length > 0 && !displayedNotifications.some(n => n.id === notifications[0].id)) {
      setDisplayedNotifications((prevState) => [...prevState, notifications[0]]);
      const timeoutId = setTimeout(() => {
        removeNotification(notifications[0].id);
        setDisplayedNotifications((prevState) => prevState.filter(n => n.id !== notifications[0].id));
      }, 5000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-0 right-0 m-4">
      {displayedNotifications.map((notification) => (
        <Notification 
          key={notification.id} 
          text={notification.text} 
          removeNotification={removeNotification} 
          id={notification.id}
        />
      ))}
    </div>
  );
};

  export default NotificationContainer;