import { useState, useEffect } from "react";

export const AnimatedTitle = ({ text }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [direction, setDirection] = useState("in");

  useEffect(() => {
    const len = text.length;

    if (direction === "in") {
      if (visibleCount < len) {
        const t = setTimeout(() => setVisibleCount((c) => c + 1), 80);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDirection("out"), 2000);
        return () => clearTimeout(t);
      }
    }

    if (direction === "out") {
      if (visibleCount > 0) {
        const t = setTimeout(() => setVisibleCount((c) => c - 1), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDirection("in"), 400);
        return () => clearTimeout(t);
      }
    }
  }, [visibleCount, direction, text]);

  return (
    <h1 className="text-lg font-bold tracking-wide">
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? "translateY(0px)" : "translateY(6px)",
            transition: "opacity 0.15s ease, transform 0.15s ease",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};