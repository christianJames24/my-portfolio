// BackgroundGradient.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnimatedDigit({ digit, direction }) {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [prevDigit, setPrevDigit] = useState(digit);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setPrevDigit(currentDigit);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setCurrentDigit(digit);
        setIsAnimating(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        width: "0.6em",
        height: "1em",
        verticalAlign: "top",
      }}
    >
      {/* Previous digit sliding out */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          transition: isAnimating
            ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease"
            : "none",
          transform: isAnimating
            ? `translateY(${direction === "up" ? "-100%" : "100%"})`
            : "translateY(0)",
          opacity: isAnimating ? 0 : 1,
        }}
      >
        {isAnimating ? prevDigit : currentDigit}
      </div>

      {/* New digit sliding in */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          transition: isAnimating
            ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease"
            : "none",
          transform: isAnimating
            ? "translateY(0)"
            : `translateY(${direction === "up" ? "100%" : "-100%"})`,
          opacity: isAnimating ? 1 : 0,
        }}
      >
        {digit}
      </div>
    </div>
  );
}

export default function BackgroundGradient() {
  const location = useLocation();

  const pageConfig = {
    "/": {
      number: 1,
      color1: "var(--color-magenta)",
      color2: "var(--color-neon-green)",
      title: "HOME",
    },
    "/about": {
      number: 2,
      color1: "var(--color-cyan)",
      color2: "var(--color-magenta)",
      title: "ABOUT",
    },
    "/projects": {
      number: 3,
      color1: "var(--color-neon-green)",
      color2: "var(--color-cyan)",
      title: "PROJECTS",
    },
    "/resume": {
      number: 4,
      color1: "var(--color-magenta)",
      color2: "var(--color-cyan)",
      title: "RESUME",
    },
    "/comments": {
      number: 5,
      color1: "var(--color-cyan)",
      color2: "var(--color-neon-green)",
      title: "TESTIMONIALS",
    },
    "/dashboard": {
      number: 6,
      color1: "var(--color-neon-green)",
      color2: "var(--color-magenta)",
      title: "DASHBOARD",
    },
  };

  const config = pageConfig[location.pathname] || pageConfig["/"];
  const [prevNumber, setPrevNumber] = useState(config.number);

  const direction = config.number > prevNumber ? "up" : "down";

  useEffect(() => {
    setPrevNumber(config.number);
  }, [config.number]);

  const numberString = String(config.number).padStart(2, "0");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        background: "var(--color-black)",
        overflow: "hidden",
      }}
    >
      {/* HUGE page number background - slots up/down */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-15deg)",
          fontSize: "clamp(200px, 35vw, 600px)",
          fontWeight: "900",
          color: config.color1,
          opacity: 0.08,
          fontFamily: "var(--font-countdown)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          textShadow: `20px 20px 0 ${config.color2}`,
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          transition: "color 0.6s ease-in-out, text-shadow 0.6s ease-in-out",
        }}
      >
        <AnimatedDigit digit={numberString[0]} direction={direction} />
        <AnimatedDigit digit={numberString[1]} direction={direction} />
      </div>

      {/* Page title - vertical - simple fade */}
      <div
        key={`title-${location.pathname}`}
        style={{
          position: "absolute",
          right: "5%",
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          fontSize: "clamp(40px, 8vw, 120px)",
          fontWeight: "900",
          color: config.color2,
          opacity: 0.15,
          fontFamily: "var(--font-countdown)",
          letterSpacing: "0.2em",
          textShadow: `3px 3px 0 ${config.color1}`,
          userSelect: "none",
          pointerEvents: "none",
          animation: "fadeInTitle 0.6s ease-in-out",
        }}
      >
        {config.title}
      </div>

      {/* Sharp geometric chaos */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: "35vw",
          height: "40vh",
          background: config.color1,
          opacity: 0.12,
          clipPath:
            "polygon(0 0, 95% 5%, 100% 50%, 90% 100%, 5% 95%, 0 60%)",
          transform: "rotate(25deg) skewX(-10deg)",
          border: `4px solid ${config.color2}`,
          transition:
            "background 0.6s ease-in-out, border-color 0.6s ease-in-out",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "8%",
          width: "30vw",
          height: "35vh",
          background: config.color2,
          opacity: 0.12,
          clipPath: "polygon(5% 0, 100% 10%, 95% 100%, 0 90%)",
          transform: "rotate(-20deg) skewY(8deg)",
          border: `4px solid ${config.color1}`,
          transition:
            "background 0.6s ease-in-out, border-color 0.6s ease-in-out",
        }}
      />

      <style>{`
        @keyframes fadeInTitle {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}