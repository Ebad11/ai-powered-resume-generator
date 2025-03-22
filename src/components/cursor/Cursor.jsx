import React, { useEffect, useRef } from "react";
import "./style.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (cursorRef.current) {
        const { clientX: x, clientY: y } = event;
        cursorRef.current.style.transform = `translate(${x}px, ${y}px) rotate(45deg)`;
        cursorRef.current.style.display = "block"; // Ensure it's visible on movement
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.display = "none"; // Hide cursor when leaving window
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.display = "block"; // Show cursor when re-entering
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <svg
      ref={cursorRef}
      className="custom-cursor-svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="transparent"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "none" }}
    >
      <g transform="rotate(190, 16, 16)">
        <path
          d="M4 2 L26 16 L4 30 L10 16 Z"
          stroke="#00fff2"
          strokeWidth="2.5"
          fill="rgba(0, 255, 242, 0.2)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CustomCursor;
