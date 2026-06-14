"use client";

import React, { useEffect, useMemo, useRef } from "react";

// type AnimationType = 'spin' | 'draw' | 'flow' | 'pulse';
// type LoopType = 'infinite' | 1 | '1';

export default function AnimatedIcon({
  animation = "spin",
  loop = "infinite",
  color = "#000000",
  size = 96,
  speed = 1.2,
  className,
}) {
  const iconRef = useRef(null);
  const styleRef = useRef(null);

  const parts = useMemo(() => {
    return [
      { id: "r1", type: "rect" },
      { id: "p1", type: "path" },
      { id: "r2", type: "rect" },
      { id: "p2", type: "path" },
      { id: "r3", type: "rect" },
      { id: "p3", type: "path" },
      { id: "r4", type: "rect" },
      { id: "p4", type: "path" },
    ];
  }, []);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    if (styleRef.current) styleRef.current.remove();
    const styleEl = document.createElement("style");
    styleRef.current = styleEl;
    document.head.appendChild(styleEl);

    const allParts = [...icon.querySelectorAll("rect, path")];
    const dur = `${speed}s`;
    const iter = loop === "1" || loop === 1 ? "1" : "infinite";

    allParts.forEach((el) => {
      el.style.stroke = color;
      el.style.animation = "none";
      el.style.strokeDasharray = "";
      el.style.strokeDashoffset = "";
      el.style.opacity = "1";
      el.style.fill = "none";
    });

    icon.style.animation = "none";

    const totalLen = (el) => {
      try {
        return typeof el.getTotalLength === "function"
          ? el.getTotalLength()
          : 30;
      } catch {
        return 30;
      }
    };

    if (animation === "spin") {
      styleEl.textContent = `
        @keyframes spinIcon { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `;
      icon.style.transformOrigin = "50% 50%";
      icon.style.animation = `spinIcon ${dur} linear ${iter}`;
    }

    if (animation === "draw") {
      styleEl.textContent = `
        @keyframes drawIn { from { stroke-dashoffset: var(--l); } to { stroke-dashoffset: 0; } }
      `;
      allParts.forEach((el, i) => {
        const l = totalLen(el);
        el.style.setProperty("--l", String(l));
        el.style.strokeDasharray = String(l);
        el.style.strokeDashoffset = String(l);
        const delay = `${(i * speed * 0.12).toFixed(2)}s`;
        el.style.animation = `drawIn ${dur} ease forwards ${delay} ${iter}`;
      });
    }

    if (animation === "flow") {
      styleEl.textContent = `
        @keyframes flowLine { 0% { stroke-dashoffset: 40; } 100% { stroke-dashoffset: 0; } }
      `;
      allParts.forEach((el, i) => {
        el.style.strokeDasharray = "6 4";
        el.style.animation = `flowLine ${dur} linear ${iter}`;
        el.style.animationDelay = `${(i * 0.07).toFixed(2)}s`;
      });
    }

    if (animation === "pulse") {
      styleEl.textContent = `
        @keyframes pulseIcon { 0%,100% { opacity: 1; stroke-width: 2; } 50% { opacity: 0.3; stroke-width: 3.5; } }
      `;
      allParts.forEach((el, i) => {
        el.style.animation = `pulseIcon ${dur} ease-in-out ${iter}`;
        el.style.animationDelay = `${(i * speed * 0.09).toFixed(2)}s`;
      });
    }

    return () => {
      styleEl.remove();
    };
  }, [animation, color, loop, speed]);

  return (
    <svg
      ref={iconRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect id="r1" width="3" height="8" x="13" y="2" rx="1.5" />
      <path id="p1" d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
      <rect id="r2" width="3" height="8" x="8" y="14" rx="1.5" />
      <path id="p2" d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
      <rect id="r3" width="8" height="3" x="14" y="13" rx="1.5" />
      <path id="p3" d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
      <rect id="r4" width="8" height="3" x="2" y="8" rx="1.5" />
      <path id="p4" d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
    </svg>
  );
}
