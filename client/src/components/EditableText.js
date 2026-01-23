// EditableText.js - Inline text editing component
import React, { useState, useRef, useEffect } from "react";
import { useEdit } from "./EditContext";

export default function EditableText({
    value,
    field,
    page,
    language,
    onSave,
    multiline = false,
    as: Component = "span",
    className = "",
    style = {},
    ...props
}) {
    const { isEditing, canEdit, saveField } = useEdit();
    const [localValue, setLocalValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const [isFieldEditing, setIsFieldEditing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isFieldEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isFieldEditing]);

    const handleClick = () => {
        if (isEditing && canEdit) {
            setIsFieldEditing(true);
        }
    };

    const handleBlur = async () => {
        setIsFieldEditing(false);

        if (localValue !== value) {
            setIsSaving(true);
            try {
                if (onSave) {
                    await onSave(localValue);
                } else {
                    await saveField(page, field, localValue, language);
                }
            } catch (err) {
                console.error("Failed to save:", err);
                setLocalValue(value); // Revert on error
            }
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setLocalValue(value);
            setIsFieldEditing(false);
        }
        if (e.key === "Enter" && !multiline) {
            e.target.blur();
        }
    };

    // Read-only mode (not admin or not in edit mode)
    if (!canEdit || !isEditing) {
        return (
            <Component className={className} style={style} {...props}>
                {value}
            </Component>
        );
    }

    // Edit mode but not actively editing this field
    if (!isFieldEditing) {
        return (
            <Component
                className={`editable-field editable-field--can-edit ${className}`}
                style={{ ...style, cursor: "pointer" }}
                onClick={handleClick}
                title="Click to edit"
                {...props}
            >
                {localValue}
                {isSaving && <span className="editable-saving">...</span>}
            </Component>
        );
    }

    // Actively editing this field
    const inputStyle = {
        ...style,
        width: "100%",
        font: "inherit",
        color: "#000000",
        background: "#ffffff",
        border: "2px dashed var(--color-magenta)",
        padding: "4px 8px",
        borderRadius: "4px",
        outline: "none",
    };

    if (multiline) {
        return (
            <textarea
                ref={inputRef}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`editable-field editable-field--editing ${className}`}
                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                {...props}
            />
        );
    }

    return (
        <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`editable-field editable-field--editing ${className}`}
            style={inputStyle}
            {...props}
        />
    );
}
