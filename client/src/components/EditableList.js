// EditableList.js - Inline list/array editing component
import React, { useState } from "react";
import { useEdit } from "./EditContext";
import EditableText from "./EditableText";

export default function EditableList({
    items,
    field,
    page,
    language,
    onSave,
    renderItem,
    itemFields,
    className = "",
}) {
    const { isEditing, canEdit, saveField } = useEdit();
    const [localItems, setLocalItems] = useState(items);
    const [isSaving, setIsSaving] = useState(false);

    const handleItemChange = async (index, itemField, value) => {
        const newItems = [...localItems];
        newItems[index] = { ...newItems[index], [itemField]: value };
        setLocalItems(newItems);

        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(newItems);
            } else {
                await saveField(page, field, newItems, language);
            }
        } catch (err) {
            console.error("Failed to save list:", err);
        }
        setIsSaving(false);
    };

    const handleAddItem = async () => {
        const newItem = {};
        itemFields.forEach(f => {
            newItem[f.key] = f.default || "";
        });
        const newItems = [...localItems, newItem];
        setLocalItems(newItems);

        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(newItems);
            } else {
                await saveField(page, field, newItems, language);
            }
        } catch (err) {
            console.error("Failed to add item:", err);
        }
        setIsSaving(false);
    };

    const handleRemoveItem = async (index) => {
        const newItems = localItems.filter((_, i) => i !== index);
        setLocalItems(newItems);

        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(newItems);
            } else {
                await saveField(page, field, newItems, language);
            }
        } catch (err) {
            console.error("Failed to remove item:", err);
        }
        setIsSaving(false);
    };

    const handleMoveItem = async (index, direction) => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= localItems.length) return;

        const newItems = [...localItems];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setLocalItems(newItems);

        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(newItems);
            } else {
                await saveField(page, field, newItems, language);
            }
        } catch (err) {
            console.error("Failed to reorder:", err);
        }
        setIsSaving(false);
    };

    // Read-only mode
    if (!canEdit || !isEditing) {
        return (
            <div className={className}>
                {items.map((item, index) => renderItem(item, index))}
            </div>
        );
    }

    // Edit mode
    return (
        <div className={`editable-list ${className}`}>
            {isSaving && <div className="editable-list-saving">Saving...</div>}

            {localItems.map((item, index) => (
                <div key={index} className="editable-list-item" style={{
                    position: "relative",
                    marginBottom: "24px",
                    padding: "16px",
                    border: "2px dashed var(--color-cyan)",
                    background: "rgba(255,255,255,0.5)",
                }}>
                    {/* Item controls */}
                    <div style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                    }}>
                        <button
                            onClick={() => handleMoveItem(index, "up")}
                            disabled={index === 0}
                            style={{
                                padding: "4px 8px",
                                fontSize: "12px",
                                cursor: index === 0 ? "not-allowed" : "pointer",
                                opacity: index === 0 ? 0.5 : 1,
                            }}
                        >
                            ↑ Move Up
                        </button>
                        <button
                            onClick={() => handleMoveItem(index, "down")}
                            disabled={index === localItems.length - 1}
                            style={{
                                padding: "4px 8px",
                                fontSize: "12px",
                                cursor: index === localItems.length - 1 ? "not-allowed" : "pointer",
                                opacity: index === localItems.length - 1 ? 0.5 : 1,
                            }}
                        >
                            ↓ Move Down
                        </button>
                        <button
                            onClick={() => handleRemoveItem(index)}
                            style={{
                                padding: "4px 8px",
                                fontSize: "12px",
                                background: "var(--color-magenta)",
                                color: "white",
                                border: "1px solid var(--color-black)",
                                cursor: "pointer",
                            }}
                        >
                            ✕ Remove
                        </button>
                    </div>

                    {/* Item fields */}
                    {itemFields.map((fieldDef) => (
                        <div key={fieldDef.key} style={{ marginBottom: "8px" }}>
                            <label style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginBottom: "4px",
                                color: "var(--color-black)",
                            }}>
                                {fieldDef.label}:
                            </label>
                            <EditableText
                                value={item[fieldDef.key] || ""}
                                field={`${field}[${index}].${fieldDef.key}`}
                                page={page}
                                language={language}
                                multiline={fieldDef.multiline}
                                onSave={(value) => handleItemChange(index, fieldDef.key, value)}
                                style={{ width: "100%" }}
                            />
                        </div>
                    ))}
                </div>
            ))}

            <button
                onClick={handleAddItem}
                className="editable-list-add"
                style={{
                    padding: "12px 24px",
                    background: "var(--color-neon-green)",
                    border: "2px solid var(--color-black)",
                    boxShadow: "4px 4px 0 var(--color-black)",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                }}
            >
                + Add Item
            </button>
        </div>
    );
}
