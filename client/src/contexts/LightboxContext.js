// LightboxContext.js
import React, { createContext, useState, useCallback } from "react";

export const LightboxContext = createContext();

export const LightboxProvider = ({ children }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  return (
    <LightboxContext.Provider value={{ isLightboxOpen, openLightbox, closeLightbox }}>
      {children}
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => {
  const context = React.useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
};
