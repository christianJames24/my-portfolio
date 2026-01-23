// ExportButton.js - Admin button to export page content as JSON
import React, { useState } from "react";
import { useEdit } from "./EditContext";

export default function ExportButton({ page, language = "en" }) {
    const { canEdit, exportContent } = useEdit();
    const [isExporting, setIsExporting] = useState(false);

    if (!canEdit) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportContent(page, language);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export content");
        }
        setIsExporting(false);
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="export-button"
            style={{
                padding: "10px 20px",
                background: "var(--color-cyan)",
                color: "var(--color-black)",
                border: "2px solid var(--color-black)",
                boxShadow: "4px 4px 0 var(--color-black)",
                cursor: isExporting ? "wait" : "pointer",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "12px",
                transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
                if (!isExporting) {
                    e.target.style.transform = "translate(-2px, -2px)";
                    e.target.style.boxShadow = "6px 6px 0 var(--color-black)";
                }
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = "translate(0, 0)";
                e.target.style.boxShadow = "4px 4px 0 var(--color-black)";
            }}
        >
            {isExporting ? "Exporting..." : `Export ${page}-${language}.json`}
        </button>
    );
}
