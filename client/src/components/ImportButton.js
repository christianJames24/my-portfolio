// ImportButton.js - Admin component to import page content from JSON
import React, { useRef, useState } from "react";
import { useEdit } from "./EditContext";

export default function ImportButton({ page, language }) {
    const { importContent } = useEdit();
    const fileInputRef = useRef(null);
    const [isImporting, setIsImporting] = useState(false);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const text = await file.text();
            let content;
            try {
                content = JSON.parse(text);
            } catch (err) {
                alert("Invalid JSON file");
                setIsImporting(false);
                return;
            }

            await importContent(page, content, language);
            alert("Content imported successfully! The page will reload.");
            window.location.reload();
        } catch (err) {
            console.error("Import failed:", err);
            alert("Failed to import content: " + err.message);
        }
        setIsImporting(false);
        // Reset input
        e.target.value = "";
    };

    return (
        <>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <button
                onClick={handleButtonClick}
                disabled={isImporting}
                style={{
                    padding: "8px 16px",
                    background: "var(--color-yellow)",
                    color: "var(--color-black)",
                    border: "2px solid var(--color-black)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    cursor: isImporting ? "wait" : "pointer",
                    boxShadow: "4px 4px 0 var(--color-black)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                {isImporting ? "Importing..." : "Import JSON"}
            </button>
        </>
    );
}
