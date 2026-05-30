"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function getScrollProgress() {
  if (typeof window === "undefined") return 0;
  const doc = document.documentElement;
  const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
  return Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
}

export function ScrollProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      setProgress(getScrollProgress());
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (pathname === "/") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-6 left-0 right-0 z-30"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative h-2 overflow-hidden rounded-full bg-border/60 shadow-sm">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/70 transition-[width] duration-150"
            style={{ width: `${(progress * 100).toFixed(4)}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-foreground/80 shadow-[0_0_12px_rgba(0,0,0,0.2)] transition-[left] duration-150"
            style={{ left: `calc(${(progress * 100).toFixed(4)}% - 6px)` }}
          />
        </div>
      </div>
    </div>
  );
}
