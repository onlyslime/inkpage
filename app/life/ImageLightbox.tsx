"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  src: string | null;
  open: boolean;
  onClose: () => void;
  /** 无障碍：对话框标题 */
  dialogLabel: string;
  /** 关闭按钮文案 */
  closeLabel: string;
};

/**
 * Full-screen lightbox overlay for viewing images. Click backdrop or close button to exit.
 */
export function ImageLightbox({
  src,
  open,
  onClose,
  dialogLabel,
  closeLabel,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open || !src) return null;

  const node = (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <span id={titleId} className="sr-only">
        {dialogLabel}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-xl leading-none text-white transition hover:bg-black/70"
        aria-label={closeLabel}
      >
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-[min(88vh,960px)] max-w-[min(96vw,1200px)] object-contain shadow-2xl"
      />
    </div>
  );

  return createPortal(node, document.body);
}
