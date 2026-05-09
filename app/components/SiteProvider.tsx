"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { isLivelyExcludedTarget } from "@/lib/livelyExclude";

export type Locale = "zh" | "en";

/** 全局点击发射子弹：由 TextEscapeBlock 注册，坐标为视口 clientX/Y */
export type LivelyPointerShootHandler = (
  clientX: number,
  clientY: number,
) => void;

export type SiteContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  livelyMode: boolean;
  setLivelyMode: Dispatch<SetStateAction<boolean>>;
  reducedMotion: boolean;
  /** 灵动排版块在挂载时注册，全局任意位置点击会调用 */
  registerLivelyPointerShoot: (handler: LivelyPointerShootHandler) => () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");
  const [livelyMode, setLivelyMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const livelyShootHandlersRef = useRef(new Set<LivelyPointerShootHandler>());

  const registerLivelyPointerShoot = useCallback(
    (handler: LivelyPointerShootHandler) => {
      livelyShootHandlersRef.current.add(handler);
      return () => {
        livelyShootHandlersRef.current.delete(handler);
      };
    },
    [],
  );

  useEffect(() => {
    if (!livelyMode || reducedMotion) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (isLivelyExcludedTarget(e.target)) return;
      if (
        e.target instanceof Element &&
        e.target.closest(
          "a[href], button, input, textarea, select, label, [role='button']",
        )
      ) {
        return;
      }
      const handlers = livelyShootHandlersRef.current;
      if (handlers.size === 0) return;
      for (const h of handlers) {
        h(e.clientX, e.clientY);
      }
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [livelyMode, reducedMotion]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) setLivelyMode(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((l) => (l === "zh" ? "en" : "zh"));
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      livelyMode,
      setLivelyMode,
      reducedMotion,
      registerLivelyPointerShoot,
    }),
    [locale, toggleLocale, livelyMode, reducedMotion, registerLivelyPointerShoot],
  );

  return (
    <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
  );
}
