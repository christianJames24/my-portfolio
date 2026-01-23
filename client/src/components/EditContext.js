// EditContext.js - Context for managing inline editing state
import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const EditContext = createContext();

export function EditProvider({ children, isAdmin }) {
    const [isEditing, setIsEditing] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const canEdit = isAdmin;

    const toggleEditMode = useCallback(() => {
        if (canEdit) {
            setIsEditing((prev) => !prev);
        }
    }, [canEdit]);

    // Save a single field to the backend
    const saveField = useCallback(async (page, field, value, language = "en") => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/content/${page}/field`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ field, value, language }),
            });

            if (!response.ok) {
                throw new Error("Failed to save field");
            }

            return await response.json();
        } catch (err) {
            console.error("Error saving field:", err);
            throw err;
        }
    }, [getAccessTokenSilently]);

    // Save full content for a page
    const saveContent = useCallback(async (page, content, language = "en") => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/content/${page}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content, language }),
            });

            if (!response.ok) {
                throw new Error("Failed to save content");
            }

            return await response.json();
        } catch (err) {
            console.error("Error saving content:", err);
            throw err;
        }
    }, [getAccessTokenSilently]);

    // Export content as JSON file download
    const exportContent = useCallback(async (page, language = "en") => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/content/${page}/export?lang=${language}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to export content");
            }

            // Trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${page}-${language}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error exporting content:", err);
            throw err;
        }
    }, [getAccessTokenSilently]);

    return (
        <EditContext.Provider
            value={{
                isEditing,
                canEdit,
                toggleEditMode,
                saveField,
                saveContent,
                exportContent,
            }}
        >
            {children}
        </EditContext.Provider>
    );
}

export function useEdit() {
    const context = useContext(EditContext);
    if (!context) {
        throw new Error("useEdit must be used within an EditProvider");
    }
    return context;
}

export default EditContext;
