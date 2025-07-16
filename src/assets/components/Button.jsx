// Button.jsx (your reusable button component)
import React, { useState } from "react";

export default function Button({ onClick, disabled, loading, children, margin = "1rem 0" }) {
  const [hover, setHover] = useState(false);

  const btnStyle = {
    border: "none",
    margin, 
    width: "15em",
    height: "4em",
    borderRadius: "3em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    background: disabled
      ? "#9CA3AF"
      : hover
      ? "linear-gradient(0deg,#A47CF3,#683FEA)"
      : "#000000",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 450ms ease-in-out",
    boxShadow: disabled
      ? "none"
      : hover
      ? `inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
         inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
         0px 0px 0px 4px rgba(255, 255, 255, 0.2),
         0px 0px 180px 0px #9917FF`
      : "none",
    transform: hover && !disabled ? "translateY(-2px)" : "none",
    pointerEvents: disabled ? "none" : "auto",
  };

  const sparkleStyle = {
    fill: disabled ? "#6B7280" : hover ? "white" : "#AAAAAA",
    transition: "all 800ms ease",
    transform: hover && !disabled ? "scale(1.2)" : "scale(1)",
    height: 24,
    width: 24,
  };

  const textStyle = {
    fontWeight: 600,
    color: disabled ? "#6B7280" : hover ? "white" : "#AAAAAA",
    fontSize: "medium",
    transition: "color 450ms ease-in-out",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={btnStyle}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={typeof children === "string" ? children : "Button"}
    >
      <svg
        style={sparkleStyle}
        viewBox="0 0 24 24"
        data-name="Layer 1"
        id="Layer_1"
      >
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
      </svg>
      <span style={textStyle}>{loading ? "Analyzing..." : children}</span>
    </button>
  );
}
