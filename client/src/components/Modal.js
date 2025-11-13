import React, { useState, useEffect } from "react";
import { MODAL_CONTENT, getModalContent } from "../constants/Navigation";

export default function Modal({ activeModal, onClose, backendData }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    setIsClosing(false);
  }, [activeModal]);

  const modalContent = backendData ? getModalContent(backendData) : MODAL_CONTENT;
  const content = modalContent[activeModal];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease",
        padding: "40px",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          minHeight: "60vh",
          maxHeight: "85%",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 248, 255, 0.98) 100%)",
          borderRadius: "40px",
          boxShadow: `
            0 20px 80px rgba(0, 0, 0, 0.25),
            inset 0 2px 0 rgba(255, 255, 255, 1),
            0 0 0 2px rgba(255, 255, 255, 0.5)
          `,
          padding: "20px 50px 50px 50px",
          position: "relative",
          overflow: "visible",
          animation: isClosing
            ? "modalSlideOut 0.4s cubic-bezier(0.4, 0, 1, 1)"
            : "modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "70%",
            background:
              "radial-gradient(circle at 50% 0%, rgba(135, 206, 250, 0.25) 0%, transparent 60%)",
            pointerEvents: "none",
            borderRadius: "40px",
          }}
        />
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            width: "48px",
            height: "48px",
            border: "none",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
            fontSize: "24px",
            lineHeight: "1",
            color: "#666",
            transition: "all 0.2s",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transformOrigin: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.transform = "scale(1.10)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
        >
          ×
        </button>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              color: "#0288D1",
              marginBottom: "30px",
              fontWeight: "300",
            }}
          >
            {activeModal && content?.title}
          </h2>
          {activeModal && content?.content}
        </div>
      </div>
    </div>
  );
}