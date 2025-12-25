// PageNavigation.js
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../App";

export default function PageNavigation({ isTransitioning }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useContext(LanguageContext);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    if (isTransitioning) {
      setHoveredButton(null);
    }
  }, [isTransitioning]);

  const content = {
    en: {
      prev: "Previous",
      next: "Next",
      pages: {
        home: "Home",
        about: "About",
        projects: "Projects",
        resume: "Resume",
        comments: "Comments",
      },
    },
    fr: {
      prev: "Précédent",
      next: "Suivant",
      pages: {
        home: "Accueil",
        about: "À Propos",
        projects: "Projets",
        resume: "CV",
        comments: "Commentaires",
      },
    },
  };

  const t = content[language];

  const pages = [
    { path: "/", name: "home" },
    { path: "/about", name: "about" },
    { path: "/projects", name: "projects" },
    { path: "/resume", name: "resume" },
    { path: "/comments", name: "comments" },
  ];

  const currentIndex = pages.findIndex(
    (page) => page.path === location.pathname
  );
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < pages.length - 1;
  const prevPage = hasPrev ? pages[currentIndex - 1] : null;
  const nextPage = hasNext ? pages[currentIndex + 1] : null;

  const handlePrev = () => {
    if (hasPrev) {
      navigate(prevPage.path);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      navigate(nextPage.path);
    }
  };

  const buttonStyle = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "20px",
    border: "4px solid var(--color-black)",
    background: "var(--color-white)",
    cursor: "pointer",
    fontSize: "32px",
    fontWeight: "900",
    boxShadow: "8px 8px 0 var(--color-black)",
    transition: "all 0.2s",
    zIndex: 50,
    color: "var(--color-black)",
    width: "70px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  };

  const labelStyle = (isVisible) => ({
    position: "absolute",
    background: "var(--color-black)",
    color: "var(--color-white)",
    padding: "12px 20px",
    border: "3px solid var(--color-black)",
    boxShadow: "6px 6px 0 var(--color-yellow)",
    fontSize: "16px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    opacity: isVisible ? 1 : 0,
    pointerEvents: "none",
    transition: "opacity 0.2s, transform 0.2s",
    transform: isVisible
      ? "translateY(-50%) scale(1)"
      : "translateY(-50%) scale(0.9)",
    top: "50%",
  });

  if (isTransitioning) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation - Side arrows */}
      <div className="desktop-nav">
        {hasPrev && (
          <div
            style={{
              position: "fixed",
              left: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 50,
            }}
          >
            <button
              onClick={handlePrev}
              aria-label={`${t.prev}: ${t.pages[prevPage.name]}`}
              style={{
                ...buttonStyle,
                position: "relative",
                transform: "rotate(-3deg)",
              }}
              onMouseEnter={(e) => {
                setHoveredButton("prev");
                e.currentTarget.style.transform =
                  "rotate(0deg) translate(-4px, 0)";
                e.currentTarget.style.boxShadow = "12px 12px 0 var(--color-black)";
                e.currentTarget.style.background = "var(--color-cyan)";
                e.currentTarget.style.color = "var(--color-black)";
              }}
              onMouseLeave={(e) => {
                setHoveredButton(null);
                e.currentTarget.style.transform = "rotate(-3deg)";
                e.currentTarget.style.boxShadow = "8px 8px 0 var(--color-black)";
                e.currentTarget.style.background = "var(--color-white)";
                e.currentTarget.style.color = "var(--color-black)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "4px 4px 0 var(--color-black)";
              }}
            >
              ←
            </button>

            <div
              style={{
                ...labelStyle(hoveredButton === "prev"),
                left: "calc(100% + 20px)",
              }}
            >
              {t.pages[prevPage.name]}
            </div>
          </div>
        )}

        {hasNext && (
          <div
            style={{
              position: "fixed",
              right: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 50,
            }}
          >
            <button
              onClick={handleNext}
              aria-label={`${t.next}: ${t.pages[nextPage.name]}`}
              style={{
                ...buttonStyle,
                position: "relative",
                transform: "rotate(3deg)",
              }}
              onMouseEnter={(e) => {
                setHoveredButton("next");
                e.currentTarget.style.transform =
                  "rotate(0deg) translate(4px, 0)";
                e.currentTarget.style.boxShadow = "12px 12px 0 var(--color-black)";
                e.currentTarget.style.background = "var(--color-magenta)";
                e.currentTarget.style.color = "var(--color-white)";
              }}
              onMouseLeave={(e) => {
                setHoveredButton(null);
                e.currentTarget.style.transform = "rotate(3deg)";
                e.currentTarget.style.boxShadow = "8px 8px 0 var(--color-black)";
                e.currentTarget.style.background = "var(--color-white)";
                e.currentTarget.style.color = "var(--color-black)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "4px 4px 0 var(--color-black)";
              }}
            >
              →
            </button>

            <div
              style={{
                ...labelStyle(hoveredButton === "next"),
                right: "calc(100% + 20px)",
              }}
            >
              {t.pages[nextPage.name]}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation - Bottom bar ABOVE footer */}
      <div
        className="mobile-nav"
        style={{
          position: "fixed",
          bottom: "200px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 95,
          display: "none",
          gap: "16px",
          alignItems: "center",
        }}
      >
        {hasPrev && (
          <button
            onClick={handlePrev}
            aria-label={t.prev}
            style={{
              padding: "12px 16px",
              border: "3px solid var(--color-black)",
              background: "var(--color-cyan)",
              color: "var(--color-black)",
              fontSize: "20px",
              fontWeight: "900",
              boxShadow: "4px 4px 0 var(--color-black)",
              cursor: "pointer",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            ←
          </button>
        )}

        <div
          style={{
            background: "var(--color-black)",
            color: "var(--color-white)",
            padding: "8px 16px",
            border: "3px solid var(--color-neon-green)",
            fontSize: "13px",
            // fontWeight: '900',
            textTransform: "uppercase",
            borderRadius: "8px",
            boxShadow: "4px 4px 0 var(--color-magenta)",
          }}
        >
          {t.pages[pages[currentIndex].name]}
        </div>

        {hasNext && (
          <button
            onClick={handleNext}
            aria-label={t.next}
            style={{
              padding: "12px 16px",
              border: "3px solid var(--color-black)",
              background: "var(--color-magenta)",
              color: "var(--color-white)",
              fontSize: "20px",
              fontWeight: "900",
              boxShadow: "4px 4px 0 var(--color-black)",
              cursor: "pointer",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            →
          </button>
        )}
      </div>

      <style>{`
  @media (max-width: 1450px) {
    .desktop-nav {
      display: none !important;
    }
    
    .mobile-nav {
      display: flex !important;
    }
  }
  
  @media (min-width: 1451px) {
    .mobile-nav {
      display: none !important;
    }
  }
  
  /* Adjust for very tall mobile footers */
  @media (max-width: 480px) {
    .mobile-nav {
      bottom: 80px !important;
    }
  }
`}</style>
    </>
  );
}