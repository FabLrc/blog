"use client";

import { useEffect, useState, useRef } from "react";

interface ReadingProgressProps {
  targetId?: string;
  className?: string;
}

export default function ReadingProgress({ targetId = "article-content", className = "" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let rafId: number | null = null;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = Math.max(rect.height - winH, 0);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const pct = total > 0 ? scrolled / total : rect.top < 0 ? 1 : 0;
      setProgress(pct);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [targetId]);

  const scaleX = Math.max(0, Math.min(1, progress));
  // Update bar transform via ref to avoid JSX inline styles (lint rule)
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${scaleX})`;
    }
  }, [scaleX]);

  // Use a static Tailwind height class so it exists in the generated CSS.
  const wrapperHeightClass = "h-1"; // 0.25rem ~= 4px

  return (
    <div
      aria-hidden
      className={`fixed left-0 top-0 z-50 w-full pointer-events-none ${wrapperHeightClass} bg-muted/20 ${className}`}
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left transition-transform duration-[120ms] ease-linear bg-primary"
      />
    </div>
  );
}
