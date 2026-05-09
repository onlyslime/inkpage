"use client";

import { usePathname, useRouter } from "next/navigation";

import { useSite } from "./SiteProvider";

export function FloatingWidgets() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, livelyMode, setLivelyMode, reducedMotion } = useSite();

  const hideLively =
    pathname === "/" ||
    pathname === "/intro" ||
    pathname === "/projects" ||
    pathname.startsWith("/projects/") ||
    pathname === "/friends";

  const livelyLabel = locale === "zh" ? "灵动模式" : "Lively mode";
  const scrollTopLabel = locale === "zh" ? "回到顶部" : "Back to top";
  const refreshLabel = locale === "zh" ? "刷新页面" : "Refresh page";
  const reducedTitle =
    locale === "zh"
      ? "系统开启了减少动画，已禁用此效果"
      : "Reduced motion is on; effect disabled";

  return (
    <div
      data-lively-exclude
      className="fixed bottom-6 right-4 z-40 flex items-center gap-2 sm:bottom-8 sm:right-6"
      role="toolbar"
      aria-label={locale === "zh" ? "页面工具" : "Page tools"}
    >
      {!hideLively && (
        <div className="flex items-center gap-2 rounded-full border border-border bg-popover/95 px-3 py-2 text-popover-foreground shadow-lg backdrop-blur">
          <span className="text-xs font-medium sm:text-sm">
            {livelyLabel}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={livelyMode}
            disabled={reducedMotion}
            title={reducedMotion ? reducedTitle : livelyLabel}
            onClick={() => setLivelyMode((v) => !v)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              livelyMode && !reducedMotion ? "bg-switch-on" : "bg-switch-off"
            } ${reducedMotion ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${
                livelyMode && !reducedMotion ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => router.refresh()}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-popover/95 text-popover-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted"
        title={refreshLabel}
        aria-label={refreshLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-popover/95 text-popover-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted"
        title={scrollTopLabel}
        aria-label={scrollTopLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 15l6-6 6 6" />
        </svg>
      </button>
    </div>
  );
}
