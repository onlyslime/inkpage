"use client";

import type { ReactNode } from "react";
import { useSite } from "./SiteProvider";

const REDUCED_BANNER = {
  zh: "检测到「减少动态效果」偏好：将始终以静态排版展示本页，不启用灵动模式。",
  en: "Reduced motion is preferred: this page stays static; Lively mode is disabled.",
} as const;

export function PageShell({ children }: { children: ReactNode }) {
  const { reducedMotion, locale } = useSite();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-28 pt-6 sm:px-8">
      {reducedMotion && (
        <p
          data-lively-exclude
          className="mb-8 rounded-lg border border-warning-border bg-warning-bg px-3 py-2 text-sm text-warning-text"
        >
          {REDUCED_BANNER[locale]}
        </p>
      )}
      {children}
    </div>
  );
}
