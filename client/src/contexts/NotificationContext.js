// client/src/contexts/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

let notificationId = 0;

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = "info", duration = 5000) => {
        const id = ++notificationId;
        const notification = { id, message, type, duration };

        setNotifications((prev) => [...prev, notification]);

        if (duration !== null && duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const notify = useCallback((message, type = "info", duration = 5000) => {
        return addNotification(message, type, duration);
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
