"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import frame0 from "@/data/life_photos/progress_bar/cutout/progress_bar0.png";
import frame1 from "@/data/life_photos/progress_bar/cutout/progress_bar1.png";
import frame2 from "@/data/life_photos/progress_bar/cutout/progress_bar2.png";
import frame3 from "@/data/life_photos/progress_bar/cutout/progress_bar3.png";
import frame4 from "@/data/life_photos/progress_bar/cutout/progress_bar4.png";
import frame5 from "@/data/life_photos/progress_bar/cutout/progress_bar5.png";

const FRAMES = [frame0, frame1, frame2, frame3, frame4, frame5];

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

  const frameIndex = useMemo(() => {
    const steps = Math.floor(progress * 22);
    return steps % FRAMES.length;
  }, [progress]);

  const frame = FRAMES[frameIndex];
  const bounce = Math.abs(Math.sin(progress * Math.PI * 12)) * 6;
  const squash = frameIndex === 2 ? 0.95 : frameIndex === 1 ? 1.02 : 1;
  const iconWidth = 34;
  const left = `calc(${(progress * 100).toFixed(4)}% - ${(progress * iconWidth).toFixed(2)}px)`;

  if (pathname === "/") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-16 left-0 right-0 z-30"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative h-10 overflow-hidden">
          <div
            className="absolute bottom-0 will-change-transform"
            style={{
              left,
              transform: `translateY(${-bounce}px) scale(${squash})`,
              transformOrigin: "center bottom",
            }}
          >
            <div className="relative h-[34px] w-[34px]">
              <div
                className="absolute inset-x-1 bottom-0 h-1 rounded-full bg-black/6 blur-[2px]"
                style={{ transform: `scaleX(${0.9 + bounce / 36})` }}
              />
              <Image
                src={frame}
                alt=""
                className="relative z-10 h-[34px] w-[34px] object-contain opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
