import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

import "../styles/BubbleMenu.css";

const DEFAULT_ITEMS = [
  {
    label: "home",
    href: "#",
    ariaLabel: "Home",
    rotation: -8,
    hoverStyles: { bgColor: "#ff0055", textColor: "#ffffff" },
  },
  {
    label: "about",
    href: "#",
    ariaLabel: "About",
    rotation: 8,
    hoverStyles: { bgColor: "#00d4ff", textColor: "#ffffff" },
  },
  {
    label: "projects",
    href: "#",
    ariaLabel: "Documentation",
    rotation: 8,
    hoverStyles: { bgColor: "#ffff00", textColor: "#000000" },
  },
  {
    label: "blog",
    href: "#",
    ariaLabel: "Blog",
    rotation: 8,
    hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" },
  },
  {
    label: "contact",
    href: "#",
    ariaLabel: "Contact",
    rotation: -8,
    hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" },
  },
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  onItemClick,
  className,
  style,
  menuAriaLabel = "Toggle menu",
  menuBg = "#fff",
  menuContentColor = "#000",
  useFixedPosition = false,
  items,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12,
  isDisabled = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);
  const backdropRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const containerClassName = [
    "bubble-menu",
    useFixedPosition ? "fixed" : "absolute",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentlyHovering, setCurrentlyHovering] = useState(null);

  const handleItemHover = useCallback(
    (idx, isHovering) => {
      if (isDisabled) return;

      const bubble = bubblesRef.current[idx];
      if (!bubble) return;

      const item = menuItems[idx];
      if (isHovering) {
        bubble.style.background = item.hoverStyles?.bgColor || "#ffffff";
        bubble.style.color = item.hoverStyles?.textColor || menuContentColor;
        bubble.style.transform = `rotate(0deg) scale(1.05) translate(-4px, -4px)`;
        bubble.style.boxShadow = "12px 12px 0 #000000";
      } else {
        bubble.style.background = menuBg;
        bubble.style.color = menuContentColor;
        bubble.style.transform = `rotate(${item.rotation ?? 0}deg) scale(1)`;
        bubble.style.boxShadow = "8px 8px 0 #000000";
      }
    },
    [isDisabled, menuItems, menuContentColor, menuBg]
  );

  const handleItemClick = (e, item, idx) => {
    e.preventDefault();
    if (!isDisabled && onItemClick) {
      handleItemHover(idx, false);
      setHoveredIndex(idx);
      closeMenu();
      onItemClick(item, idx);
    }
  };

  const handleMouseEnter = (idx) => {
    setCurrentlyHovering(idx);
    handleItemHover(idx, true);
  };

  const handleMouseLeave = (idx) => {
    setCurrentlyHovering(null);
    handleItemHover(idx, false);
  };

  useEffect(() => {
    if (
      !isDisabled &&
      hoveredIndex !== null &&
      currentlyHovering === hoveredIndex
    ) {
      handleItemHover(hoveredIndex, true);
    }
    if (!isDisabled) {
      setHoveredIndex(null);
    }
  }, [isDisabled, hoveredIndex, handleItemHover, currentlyHovering]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length || !backdrop) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.set(backdrop, { display: "block" });
      gsap.killTweensOf([...bubbles, ...labels, backdrop]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      gsap.to(backdrop, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: "power3.out",
            },
            `-=${animationDuration * 0.9}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels, backdrop]);
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power3.in",
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          gsap.set(backdrop, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;

        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? item.rotation ?? 0 : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <nav
        className={containerClassName}
        style={style}
        aria-label="Main navigation"
      >
        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${
            isMenuOpen ? "open" : ""
          }`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ 
            background: menuBg,
            border: '4px solid #000000',
            boxShadow: '6px 6px 0 #000000',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = '8px 8px 0 #000000';
            e.currentTarget.style.background = '#ffff00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-2deg)';
            e.currentTarget.style.boxShadow = '6px 6px 0 #000000';
            e.currentTarget.style.background = menuBg;
          }}
        >
          <span
            className="menu-line"
            style={{ background: menuContentColor }}
          />
          <span
            className="menu-line short"
            style={{ background: menuContentColor }}
          />
        </button>
      </nav>

      {showOverlay && (
        <>
          <div
            ref={backdropRef}
            onClick={closeMenu}
            style={{
              position: useFixedPosition ? "fixed" : "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 97,
              opacity: 0,
              display: "none",
            }}
          />

          <div
            ref={overlayRef}
            className={`bubble-menu-items ${
              useFixedPosition ? "fixed" : "absolute"
            }`}
            aria-hidden={!isMenuOpen}
          >
            <ul className="pill-list" role="menu" aria-label="Menu links">
              {menuItems.map((item, idx) => (
                <li key={idx} role="none" className="pill-col">
                  <a
                    role="menuitem"
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item, idx)}
                    onMouseEnter={() => handleMouseEnter(idx)}
                    onMouseLeave={() => handleMouseLeave(idx)}
                    aria-label={item.ariaLabel || item.label}
                    className="pill-link"
                    style={{
                      "--item-rot": `${item.rotation ?? 0}deg`,
                      "--pill-bg": menuBg,
                      "--pill-color": menuContentColor,
                      "--hover-bg": item.hoverStyles?.bgColor || "#ffffff",
                      "--hover-color": item.hoverStyles?.textColor || menuContentColor,
                      pointerEvents: isDisabled ? "none" : "auto",
                      opacity: isDisabled ? 0.5 : 1,
                      cursor: isDisabled ? "default" : "pointer",
                      userSelect: "none",
                      border: "4px solid #000000",
                      background: menuBg,
                      boxShadow: "8px 8px 0 #000000",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}
                    ref={(el) => {
                      if (el) bubblesRef.current[idx] = el;
                    }}
                  >
                    <span
                      className="pill-label"
                      ref={(el) => {
                        if (el) labelRefs.current[idx] = el;
                      }}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}