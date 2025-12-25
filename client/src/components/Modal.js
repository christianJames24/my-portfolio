// Modal.js
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
        background: "rgba(0, 0, 0, 0.6)",
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
          background: "var(--color-white)",
          border: "5px solid var(--color-black)",
          boxShadow: "16px 16px 0 var(--color-black)",
          padding: "20px 50px 50px 50px",
          position: "relative",
          overflow: "visible",
          animation: isClosing
            ? "modalSlideOut 0.4s cubic-bezier(0.4, 0, 1, 1)"
            : "modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "center",
          transform: "rotate(-0.5deg)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yellow accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "12px",
            background: "var(--color-yellow)",
            borderBottom: "3px solid var(--color-black)"
          }}
        />
        
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            width: "56px",
            height: "56px",
            border: "3px solid var(--color-black)",
            background: "var(--color-red-pink)",
            boxShadow: "4px 4px 0 var(--color-black)",
            cursor: "pointer",
            fontSize: "28px",
            fontWeight: "900",
            lineHeight: "1",
            color: "var(--color-white)",
            transition: "all 0.2s",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transformOrigin: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-2px, -2px)";
            e.currentTarget.style.boxShadow = "6px 6px 0 var(--color-black)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0, 0)";
            e.currentTarget.style.boxShadow = "4px 4px 0 var(--color-black)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translate(2px, 2px)";
            e.currentTarget.style.boxShadow = "2px 2px 0 var(--color-black)";
          }}
        >
          ×
        </button>
        
        <div style={{ position: "relative", zIndex: 1, marginTop: "40px" }}>
          <h2
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              color: "var(--color-black)",
              marginBottom: "30px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              position: "relative",
              display: "inline-block",
              transform: "rotate(1deg)"
            }}
          >
            {activeModal && content?.title}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: "-10px",
              right: "-10px",
              height: "50%",
              background: "var(--color-yellow)",
              zIndex: -1
            }} />
          </h2>
          {activeModal && content?.content}
        </div>
      </div>
    </div>
  );
}