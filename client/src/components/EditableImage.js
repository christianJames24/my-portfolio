// EditableImage.js - Inline image editing component with upload support
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useEdit } from "./EditContext";
import { useAuth0 } from "@auth0/auth0-react";

export default function EditableImage({
    src,
    alt,
    field,
    page,
    language,
    onSave,
    onImageClick,
    className = "",
    style = {},
    ...props
}) {
    const { isEditing, canEdit, saveField } = useEdit();
    const { getAccessTokenSilently } = useAuth0();
    const [showModal, setShowModal] = useState(false);

    // Parse src prop which can be string or object
    const getInitialState = React.useCallback(() => {
        if (typeof src === 'object' && src !== null) {
            return { url: src.url || '', noBorder: !!src.noBorder };
        }
        return { url: src || '', noBorder: false };
    }, [src]);

    const [imageData, setImageData] = useState(getInitialState());

    // Update local state when prop changes
    useEffect(() => {
        setImageData(getInitialState());
    }, [getInitialState]);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);

    // Edit state (separate from display state)
    const [editUrl, setEditUrl] = useState('');
    const [editNoBorder, setEditNoBorder] = useState(false);

    const handleEditClick = (e) => {
        e.stopPropagation();
        const state = getInitialState();
        setEditUrl(state.url);
        setEditNoBorder(state.noBorder);
        setUploadError("");
        setShowModal(true);
    };

    const handleSave = async () => {
        const initialState = getInitialState();
        if (editUrl !== initialState.url || editNoBorder !== initialState.noBorder) {
            setIsSaving(true);
            try {
                // Determine format to save
                // If we have structure (noBorder true) or started with structure, save as object
                // Otherwise save as string to maintain backward compatibility if user didn't change border
                let valueToSave;
                if (editNoBorder) {
                    valueToSave = { url: editUrl, noBorder: true };
                } else if (typeof src === 'object' && src !== null) {
                    // It was an object, but noBorder is false now. Keep as object for consistency?
                    // Or revert to string? Let's check if we want to clean up.
                    // If we revert to string, we lose the explicit "false" state but false is default.
                    // Let's stick to saving object if it was object, or if noBorder is true.
                    // Actually, to fully "remove" the setting, maybe string is better if noBorder is false.
                    valueToSave = editUrl;
                } else {
                    valueToSave = editUrl;
                }

                // Force object if user explicitly wants noBorder
                if (editNoBorder) {
                    valueToSave = { url: editUrl, noBorder: true };
                }

                if (onSave) {
                    await onSave(valueToSave);
                } else {
                    await saveField(page, field, valueToSave, language);
                }
            } catch (err) {
                console.error("Failed to save image:", err);
            }
            setIsSaving(false);
        }
        setShowModal(false);
    };

    const handleCancel = () => {
        setUploadError("");
        setShowModal(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setUploadError("Only image files are allowed (jpeg, png, gif, webp)");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        setUploadError("");

        try {
            const token = await getAccessTokenSilently();
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/uploads", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Upload failed");
            }

            const data = await response.json();
            // Use the uploaded image URL
            setEditUrl(data.url);
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadError(err.message || "Upload failed");
        }

        setIsUploading(false);
        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Prepare display style
    const displayStyle = { ...style, cursor: onImageClick ? 'pointer' : style.cursor };
    if (imageData.noBorder) {
        displayStyle.border = 'none';
        displayStyle.boxShadow = 'none';
        // Also remove outline if present
        displayStyle.outline = 'none';
    }

    // Modal rendered via portal to escape overflow:hidden containers
    const modal = showModal ? ReactDOM.createPortal(
        <div
            className="editable-image-modal-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
            }}
            onClick={handleCancel}
        >
            <div
                className="editable-image-modal"
                style={{
                    background: "#ffffff",
                    padding: "24px",
                    border: "4px solid #000000",
                    boxShadow: "8px 8px 0 #000000",
                    maxWidth: "500px",
                    width: "90%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ margin: "0 0 16px", color: "#000000", fontSize: "24px" }}>Edit Image</h3>

                {/* Upload Section */}
                <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "14px", color: "#333", margin: "0 0 8px", fontWeight: "bold" }}>
                        Upload New Image:
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        style={{
                            display: "block",
                            marginBottom: "8px",
                        }}
                    />
                    {isUploading && (
                        <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>
                            Uploading...
                        </p>
                    )}
                    {uploadError && (
                        <p style={{ color: "#ff0000", fontSize: "12px", margin: 0 }}>
                            {uploadError}
                        </p>
                    )}
                </div>

                <div style={{
                    borderTop: "1px solid #ddd",
                    paddingTop: "16px",
                    marginBottom: "16px"
                }}>
                    <p style={{ fontSize: "14px", color: "#333", margin: "0 0 8px", fontWeight: "bold" }}>
                        Or Enter URL:
                    </p>
                    <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Enter image URL"
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "14px",
                            border: "2px solid #000000",
                            boxSizing: "border-box",
                            color: "#000000",
                            background: "#ffffff",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
                        <input
                            type="checkbox"
                            checked={editNoBorder}
                            onChange={(e) => setEditNoBorder(e.target.checked)}
                            style={{ marginRight: "8px", width: "18px", height: "18px" }}
                        />
                        Remove Border (Transparent Background)
                    </label>
                </div>

                {editUrl && (
                    <div style={{ marginBottom: "16px" }}>
                        <p style={{ fontSize: "12px", color: "#333", margin: "0 0 8px" }}>Preview:</p>
                        <div style={{
                            background: "#f0f0f0", // Light gray bg to see transparency
                            padding: "10px",
                            border: "1px dashed #ccc",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <img
                                src={editUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    border: editNoBorder ? "none" : "2px solid #00ffff",
                                    boxShadow: editNoBorder ? "none" : "none"
                                }}
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                    </div>
                )}

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                        onClick={handleCancel}
                        style={{
                            padding: "10px 20px",
                            background: "#ffffff",
                            border: "2px solid #000000",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "#000000",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isUploading}
                        style={{
                            padding: "10px 20px",
                            background: "#39ff14",
                            border: "2px solid #000000",
                            cursor: (isSaving || isUploading) ? "wait" : "pointer",
                            fontWeight: "bold",
                            boxShadow: "3px 3px 0 #000000",
                            color: "#000000",
                        }}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            <div className={className} style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
                <img
                    src={imageData.url}
                    alt={alt}
                    style={displayStyle}
                    onClick={onImageClick}
                    {...props}
                />

                {canEdit && isEditing && (
                    <button
                        onClick={handleEditClick}
                        className="editable-image-btn"
                        style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "var(--color-magenta)",
                            color: "var(--color-white)",
                            border: "2px solid var(--color-black)",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            boxShadow: "3px 3px 0 var(--color-black)",
                            zIndex: 10,
                        }}
                    >
                        Edit Image
                    </button>
                )}
            </div>
            {modal}
        </>
    );
}
