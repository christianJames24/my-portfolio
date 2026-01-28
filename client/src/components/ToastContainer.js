// client/src/components/ToastContainer.js
import React from "react";
import { useNotification } from "../contexts/NotificationContext";

const ToastContainer = () => {
    const { notifications, removeNotification } = useNotification();

    const getTypeStyles = (type) => {
        switch (type) {
            case "success":
                return {
                    background: "var(--color-neon-green)",
                    color: "var(--color-black)",
                    borderColor: "var(--color-black)",
                };
            case "error":
                return {
                    background: "var(--color-red-pink)",
                    color: "var(--color-white)",
                    borderColor: "var(--color-black)",
                };
            case "warning":
                return {
                    background: "var(--color-yellow)",
                    color: "var(--color-black)",
                    borderColor: "var(--color-black)",
                };
            case "info":
            default:
                return {
                    background: "var(--color-cyan)",
                    color: "var(--color-white)",
                    borderColor: "var(--color-black)",
                };
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "400px",
            }}
        >
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        padding: "16px 20px",
                        border: "4px solid",
                        boxShadow: "4px 4px 0 var(--color-black)",
                        fontWeight: "700",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        animation: "slideIn 0.3s ease-out",
                        ...getTypeStyles(notification.type),
                    }}
                >
                    <span>{notification.message}</span>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            fontWeight: "900",
                            color: "inherit",
                            padding: "0 4px",
                        }}
                        aria-label="Dismiss notification"
                    >
                        ×
                    </button>
                </div>
            ))}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default ToastContainer;
