// EditModeToggle.js - Floating button to toggle edit mode
import React from "react";
import { useEdit } from "./EditContext";

export default function EditModeToggle() {
    const { canEdit, isEditing, toggleEditMode } = useEdit();

    if (!canEdit) return null;

    return (
        <button
            onClick={toggleEditMode}
            className="edit-mode-toggle"
            style={{
                position: "fixed",
                bottom: "100px",
                right: "24px",
                padding: "14px 20px",
                background: isEditing ? "var(--color-magenta)" : "var(--color-neon-green)",
                color: isEditing ? "var(--color-white)" : "var(--color-black)",
                border: "3px solid var(--color-black)",
                boxShadow: "5px 5px 0 var(--color-black)",
                cursor: "pointer",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "14px",
                zIndex: 999,
                transition: "all 0.2s",
                fontFamily: "var(--font-bold)",
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = "translate(-3px, -3px)";
                e.target.style.boxShadow = "8px 8px 0 var(--color-black)";
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = "translate(0, 0)";
                e.target.style.boxShadow = "5px 5px 0 var(--color-black)";
            }}
        >
            {isEditing ? "✓ Exit Edit Mode" : "✎ Edit Page"}
        </button>
    );
}
