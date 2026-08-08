import React from "react";
import { useTheme } from "./ThemeContext";

/**
 * Neumorphic theme toggle switch — metallic knob slides between DARK / LIGHT.
 * Inspired by the skeuomorphic ON/OFF toggle reference.
 */
const ThemeToggle = ({ size = "md" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  /* ── Size presets ── */
  const dims =
    size === "sm"
      ? { w: 64, h: 28, knob: 22, travel: 36, fontSize: 8, iconSize: 11 }
      : { w: 78, h: 34, knob: 26, travel: 44, fontSize: 9, iconSize: 13 };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center cursor-pointer select-none outline-none border-none bg-transparent p-0"
      style={{ width: dims.w, height: dims.h }}
    >
      {/* ── Track ── */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          background: isDark
            ? "linear-gradient(145deg, #1a1a1a, #2a2a2a)"
            : "linear-gradient(145deg, #d8d8d8, #f0f0f0)",
          boxShadow: isDark
            ? "4px 4px 10px rgba(0,0,0,0.6), -2px -2px 8px rgba(60,60,60,0.15), inset 2px 2px 6px rgba(0,0,0,0.5), inset -1px -1px 4px rgba(60,60,60,0.08)"
            : "4px 4px 10px rgba(0,0,0,0.12), -2px -2px 8px rgba(255,255,255,0.9), inset 2px 2px 6px rgba(0,0,0,0.08), inset -1px -1px 4px rgba(255,255,255,0.6)",
        }}
      />

      {/* ── Label — sun icon (left, visible in dark mode) ── */}
      <span
        className="absolute flex items-center justify-center transition-all duration-300"
        style={{
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: isDark ? 1 : 0,
          fontSize: dims.iconSize,
        }}
      >
        <svg
          width={dims.iconSize}
          height={dims.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDark ? "#f59e0b" : "#a3a3a3"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>

      {/* ── Label — moon icon (right, visible in light mode) ── */}
      <span
        className="absolute flex items-center justify-center transition-all duration-300"
        style={{
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: isDark ? 0 : 1,
          fontSize: dims.iconSize,
        }}
      >
        <svg
          width={dims.iconSize}
          height={dims.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDark ? "#a3a3a3" : "#6366f1"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* ── Metallic Knob ── */}
      <div
        className="absolute rounded-full transition-all duration-300 ease-in-out"
        style={{
          width: dims.knob,
          height: dims.knob,
          top: (dims.h - dims.knob) / 2,
          left: isDark
            ? dims.w - dims.knob - (dims.h - dims.knob) / 2
            : (dims.h - dims.knob) / 2,
          /* Brushed-metal effect via conic gradient */
          background: isDark
            ? `conic-gradient(
                from 0deg,
                #4a4a4a, #6a6a6a, #3a3a3a, #7a7a7a,
                #4a4a4a, #5a5a5a, #3a3a3a, #6a6a6a, #4a4a4a
              )`
            : `conic-gradient(
                from 0deg,
                #b0b0b0, #d4d4d4, #909090, #c8c8c8,
                #a0a0a0, #c0c0c0, #909090, #d0d0d0, #b0b0b0
              )`,
          boxShadow: isDark
            ? "2px 2px 6px rgba(0,0,0,0.7), -1px -1px 4px rgba(80,80,80,0.15), inset 0 1px 2px rgba(120,120,120,0.3), inset 0 -1px 1px rgba(0,0,0,0.4)"
            : "2px 2px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.8), inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(0,0,0,0.15)",
        }}
      >
        {/* Center dot — adds depth to the metallic knob */}
        <div
          className="absolute rounded-full"
          style={{
            width: dims.knob * 0.35,
            height: dims.knob * 0.35,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: isDark
              ? "radial-gradient(circle, #5a5a5a 0%, #3a3a3a 60%, #2a2a2a 100%)"
              : "radial-gradient(circle, #c8c8c8 0%, #a0a0a0 60%, #909090 100%)",
            boxShadow: isDark
              ? "inset 0 1px 2px rgba(90,90,90,0.3), inset 0 -1px 1px rgba(0,0,0,0.5)"
              : "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
