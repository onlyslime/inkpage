"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { isLivelyExcludedTarget } from "@/lib/livelyExclude";

type FleeingPhotoProps = {
  src: StaticImageData;
  alt: string;
  /** 为 false 时与普通居中照片一致，不监听指针 */
  active: boolean;
  className?: string;
};

/**
 * 指针靠近时照片沿径向避让（与 Pretext 文字绕排独立，视觉一致）。
 */
export function FleeingPhoto({
  src,
  alt,
  active,
  className = "",
}: FleeingPhotoProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const offRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) {
      if (innerRef.current) innerRef.current.style.transform = "translate(0px, 0px)";
      offRef.current = { x: 0, y: 0 };
      return;
    }

    const onMove = (e: PointerEvent) => {
      if (isLivelyExcludedTarget(e.target)) {
        offRef.current = { x: 0, y: 0 };
        if (innerRef.current)
          innerRef.current.style.transform = "translate(0px, 0px)";
        return;
      }

      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const r = outer.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy);
      const fleeDist = 160;
      const maxOff = 100;

      if (dist < fleeDist && dist > 1e-6) {
        const k = (fleeDist - dist) / fleeDist;
        const ux = -dx / dist;
        const uy = -dy / dist;
        offRef.current.x = ux * k * maxOff;
        offRef.current.y = uy * k * maxOff;
      } else {
        offRef.current.x = 0;
        offRef.current.y = 0;
      }

      const { x, y } = offRef.current;
      inner.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active]);

  return (
    <div
      ref={outerRef}
      className={`relative mx-auto flex w-full max-w-lg items-center justify-center py-2 ${className}`}
      style={{ minHeight: "min(24rem, 70vw)" }}
    >
      <div
        ref={innerRef}
        className="relative will-change-transform"
        style={{ transform: "translate(0px, 0px)" }}
      >
        <Image
          src={src}
          alt={alt}
          className="h-auto max-h-96 w-auto max-w-full rounded-xl object-cover shadow-sm ring-1 ring-border"
          sizes="(max-width: 768px) 100vw, 512px"
          priority
        />
      </div>
    </div>
  );
}
