"use client";

import {
  prepareWithSegments,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { isLivelyExcludedTarget } from "@/lib/livelyExclude";
import { useSite } from "./SiteProvider";
import {
  layoutTextAroundCircles,
  type CircleObstacle,
  type PositionedLine,
} from "@/lib/textEscapeLayout";

const PADDING = 20;
/** 鼠标障碍略小，躲指针更克制 */
const POINTER_RADIUS = 50;
const OB_H_PAD = 10;
const OB_V_PAD = 6;
/** 子弹参与折行时的有效半径，大于鼠标，避让更夸张 */
const BULLET_LAYOUT_RADIUS = 34;
const BULLET_LAYOUT_H_PAD = 14;
const BULLET_LAYOUT_V_PAD = 10;
/** 可见子弹圆点与命中判定半径 */
const BULLET_VISUAL_R = 6;
const FLEE_HIT_R = 12;
const MIN_SLOT_WIDTH = 48;
const VIRTUAL_REGION_H = 12_000_000;

const BULLET_SPEED = 12;
/** 单次点击随机 1–3 颗，并发需更高上限 */
const MAX_BULLETS = 28;
const BULLET_LIFETIME_MS = 3000;
const FLEE_COOLDOWN_MS = 900;

type Bullet = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
};

function syncLinePool(
  stage: HTMLDivElement,
  pool: HTMLSpanElement[],
  count: number,
): void {
  while (pool.length < count) {
    const el = document.createElement("span");
    el.className =
      "pointer-events-none whitespace-nowrap text-pretext will-change-transform";
    el.style.position = "absolute";
    stage.appendChild(el);
    pool.push(el);
  }
  for (let i = 0; i < pool.length; i++) {
    pool[i]!.style.display = i < count ? "" : "none";
  }
}

function linesEqual(a: PositionedLine[], b: PositionedLine[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    if (
      x.x !== y.x ||
      x.y !== y.y ||
      x.width !== y.width ||
      x.text !== y.text
    ) {
      return false;
    }
  }
  return true;
}

/** 圆与轴对齐矩形是否相交（用于命中） */
function circleHitsRect(
  cx: number,
  cy: number,
  cr: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  const nx = Math.max(rx, Math.min(cx, rx + rw));
  const ny = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < cr * cr;
}

type TextEscapeBlockProps = {
  text: string;
  escapeMode: boolean;
  reducedMotion: boolean;
  children: ReactNode;
  clipObstacleToStage?: boolean;
  className?: string;
};

const STAGE_POINTER_PAD = 8;

export function TextEscapeBlock({
  text,
  escapeMode,
  reducedMotion,
  children,
  clipObstacleToStage = false,
  className: stageClassName,
}: TextEscapeBlockProps) {
  const { registerLivelyPointerShoot } = useSite();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bulletsOverlayRef = useRef<HTMLDivElement | null>(null);
  const poolRef = useRef<HTMLSpanElement[]>([]);
  const preparedRef = useRef<PreparedTextWithSegments | null>(null);
  const pointerLocalRef = useRef({ x: -1e6, y: -1e6 });
  const fontRef = useRef("");
  const lineHeightRef = useRef(28);
  const lastLinesRef = useRef<PositionedLine[] | null>(null);
  const rafRef = useRef<number | null>(null);
  const bulletLoopRef = useRef<number | null>(null);
  const bulletsRef = useRef<Bullet[]>([]);
  const nextBulletIdRef = useRef(0);
  const fleeCooldownRef = useRef<Map<number, number>>(new Map());
  const activeRef = useRef(false);
  const clipObstacleToStageRef = useRef(clipObstacleToStage);
  clipObstacleToStageRef.current = clipObstacleToStage;

  const projectLines = useCallback(() => {
    const stage = stageRef.current;
    const prepared = preparedRef.current;
    if (!stage || !prepared) return;

    const rect = stage.getBoundingClientRect();
    const w = rect.width;
    const regionX = PADDING;
    const regionY = PADDING;
    const regionW = Math.max(0, w - 2 * PADDING);

    const px = pointerLocalRef.current.x;
    const py = pointerLocalRef.current.y;

    const circles: CircleObstacle[] = [];
    if (px > -1e5) {
      circles.push({
        cx: px,
        cy: py,
        r: POINTER_RADIUS,
        hPad: OB_H_PAD,
        vPad: OB_V_PAD,
      });
    }
    for (const b of bulletsRef.current) {
      circles.push({
        cx: b.x,
        cy: b.y,
        r: BULLET_LAYOUT_RADIUS,
        hPad: BULLET_LAYOUT_H_PAD,
        vPad: BULLET_LAYOUT_V_PAD,
      });
    }

    const lines = layoutTextAroundCircles(
      prepared,
      regionX,
      regionY,
      regionW,
      VIRTUAL_REGION_H,
      lineHeightRef.current,
      circles,
      MIN_SLOT_WIDTH,
    );

    const lh = lineHeightRef.current;
    let minH = PADDING * 2 + lh;
    if (lines.length > 0) {
      const last = lines[lines.length - 1]!;
      minH = Math.max(minH, last.y + lh + PADDING);
    } else {
      minH = Math.max(minH, 200);
    }
    stage.style.minHeight = `${Math.ceil(minH)}px`;

    const hasBullets = bulletsRef.current.length > 0;
    if (
      !hasBullets &&
      lastLinesRef.current !== null &&
      linesEqual(lastLinesRef.current, lines)
    ) {
      return;
    }
    lastLinesRef.current = lines;

    const pool = poolRef.current;
    syncLinePool(stage, pool, lines.length);

    const font = fontRef.current;
    const lhStr = `${lh}px`;

    for (let i = 0; i < lines.length; i++) {
      const el = pool[i]!;
      const line = lines[i]!;
      el.textContent = line.text;
      el.style.left = `${line.x}px`;
      el.style.top = `${line.y}px`;
      el.style.font = font;
      el.style.lineHeight = lhStr;
    }

    const now = performance.now();
    const stageW = stage.offsetWidth;
    for (const b of bulletsRef.current) {
      for (let i = 0; i < lines.length; i++) {
        if (now < (fleeCooldownRef.current.get(i) ?? 0)) continue;
        const line = lines[i]!;
        if (
          !circleHitsRect(
            b.x,
            b.y,
            FLEE_HIT_R,
            line.x,
            line.y,
            line.width,
            lh,
          )
        ) {
          continue;
        }
        fleeCooldownRef.current.set(i, now + FLEE_COOLDOWN_MS);
        const lineCenterX = line.x + line.width / 2;
        const dir = b.x < lineCenterX ? 1 : -1;
        const dist = Math.min(stageW * 0.65, 420);
        const el = pool[i]!;
        el.style.transition =
          "transform 0.38s cubic-bezier(0.34, 1.25, 0.64, 1)";
        el.style.transform = `translateX(${dir * dist}px)`;
        window.setTimeout(() => {
          el.style.transition = "transform 0.52s ease-out";
          el.style.transform = "translateX(0)";
          window.setTimeout(() => {
            el.style.transition = "";
            el.style.transform = "";
          }, 520);
        }, 400);
      }
    }
  }, []);

  const syncBulletOverlay = useCallback(() => {
    const overlay = bulletsOverlayRef.current;
    if (!overlay) return;
    const bs = bulletsRef.current;
    while (overlay.children.length < bs.length) {
      const dot = document.createElement("div");
      dot.className =
        "pointer-events-none absolute rounded-full bg-foreground/85 shadow-sm ring-1 ring-border";
      dot.style.width = `${BULLET_VISUAL_R * 2}px`;
      dot.style.height = `${BULLET_VISUAL_R * 2}px`;
      dot.style.marginLeft = `-${BULLET_VISUAL_R}px`;
      dot.style.marginTop = `-${BULLET_VISUAL_R}px`;
      overlay.appendChild(dot);
    }
    while (overlay.children.length > bs.length) {
      overlay.removeChild(overlay.lastChild!);
    }
    for (let i = 0; i < bs.length; i++) {
      const dot = overlay.children[i] as HTMLDivElement;
      const b = bs[i]!;
      dot.style.left = `${b.x}px`;
      dot.style.top = `${b.y}px`;
    }
  }, []);

  const tickBullets = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || !preparedRef.current) {
      bulletLoopRef.current = null;
      return;
    }
    const now = performance.now();
    const rect = stage.getBoundingClientRect();
    const sw = rect.width;
    const sh = stage.offsetHeight;
    const margin = 60;

    const kept: Bullet[] = [];
    for (const b of bulletsRef.current) {
      const nx = b.x + b.vx;
      const ny = b.y + b.vy;
      if (
        now - b.born > BULLET_LIFETIME_MS ||
        nx < -margin ||
        nx > sw + margin ||
        ny < -margin ||
        ny > sh + margin
      ) {
        continue;
      }
      kept.push({ ...b, x: nx, y: ny });
    }
    bulletsRef.current = kept;

    projectLines();
    syncBulletOverlay();

    if (bulletsRef.current.length > 0) {
      bulletLoopRef.current = requestAnimationFrame(tickBullets);
    } else {
      bulletLoopRef.current = null;
    }
  }, [projectLines, syncBulletOverlay]);

  const startBulletLoop = useCallback(() => {
    if (bulletLoopRef.current !== null) return;
    bulletLoopRef.current = requestAnimationFrame(tickBullets);
  }, [tickBullets]);

  /** 每次点击随机 1–3 颗，起点略错开、方向各自随机 */
  const spawnBulletsAt = useCallback(
    (baseX: number, baseY: number) => {
      const n = 1 + Math.floor(Math.random() * 3);
      const born = performance.now();
      let next = [...bulletsRef.current];
      for (let k = 0; k < n; k++) {
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * BULLET_SPEED;
        const vy = Math.sin(angle) * BULLET_SPEED;
        const id = ++nextBulletIdRef.current;
        /** 多发时略微错开，单发时与指针重合 */
        const spread = n > 1 ? 4 : 0;
        const jitter = (Math.random() - 0.5) * spread;
        const jx = (Math.random() - 0.5) * spread;
        next.push({
          id,
          x: baseX + jx,
          y: baseY + jitter,
          vx,
          vy,
          born,
        });
      }
      if (next.length > MAX_BULLETS) {
        next = next.slice(next.length - MAX_BULLETS);
      }
      bulletsRef.current = next;
      syncBulletOverlay();
      projectLines();
      startBulletLoop();
    },
    [projectLines, startBulletLoop, syncBulletOverlay],
  );

  const scheduleProject = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      projectLines();
    });
  }, [projectLines]);

  const active = escapeMode && !reducedMotion;
  activeRef.current = active;

  useEffect(() => {
    if (!active) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (bulletLoopRef.current !== null) {
        cancelAnimationFrame(bulletLoopRef.current);
        bulletLoopRef.current = null;
      }
      bulletsRef.current = [];
      fleeCooldownRef.current.clear();
      preparedRef.current = null;
      lastLinesRef.current = null;
      for (const el of poolRef.current) {
        el.remove();
      }
      poolRef.current = [];
      const overlay = bulletsOverlayRef.current;
      if (overlay) overlay.replaceChildren();
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      const cs = getComputedStyle(stage);
      fontRef.current = cs.font;
      const rawLh = cs.lineHeight;
      let lhPx = Number.parseFloat(rawLh);
      if (!Number.isFinite(lhPx)) {
        const fs = Number.parseFloat(cs.fontSize);
        lhPx = Number.isFinite(fs) ? fs * 1.5 : 28;
      }
      lineHeightRef.current = lhPx;
      preparedRef.current = prepareWithSegments(text, fontRef.current, {
        whiteSpace: "pre-wrap",
      });
      lastLinesRef.current = null;
      scheduleProject();
    });

    return () => {
      cancelled = true;
    };
  }, [active, text, scheduleProject]);

  /** 全局点击：仅当落点在本舞台矩形内时发射，坐标为相对舞台的鼠标位置（不 clamp，从指针处生成） */
  useEffect(() => {
    if (!active) return;
    const handler = (clientX: number, clientY: number) => {
      if (!activeRef.current) return;
      const stage = stageRef.current;
      if (!stage) return;
      const sr = stage.getBoundingClientRect();
      const x = clientX - sr.left;
      const y = clientY - sr.top;
      const eps = 0.5;
      if (
        x < -eps ||
        y < -eps ||
        x > sr.width + eps ||
        y > sr.height + eps
      ) {
        return;
      }
      spawnBulletsAt(x, y);
    };
    return registerLivelyPointerShoot(handler);
  }, [active, registerLivelyPointerShoot, spawnBulletsAt]);

  useEffect(() => {
    if (!active) return;

    const onPointerMove = (e: PointerEvent) => {
      if (isLivelyExcludedTarget(e.target)) {
        pointerLocalRef.current = { x: -1e6, y: -1e6 };
        lastLinesRef.current = null;
        if (bulletsRef.current.length === 0) scheduleProject();
        return;
      }
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const pad = STAGE_POINTER_PAD;
      if (clipObstacleToStageRef.current) {
        if (
          e.clientX < r.left - pad ||
          e.clientX > r.right + pad ||
          e.clientY < r.top - pad ||
          e.clientY > r.bottom + pad
        ) {
          pointerLocalRef.current = { x: -1e6, y: -1e6 };
          lastLinesRef.current = null;
          if (bulletsRef.current.length === 0) scheduleProject();
          return;
        }
      }
      pointerLocalRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      };
      if (bulletsRef.current.length === 0) scheduleProject();
    };

    const onResize = () => {
      lastLinesRef.current = null;
      if (bulletsRef.current.length === 0) scheduleProject();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    const stage = stageRef.current;
    if (!stage) {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      return;
    }

    const ro = new ResizeObserver(() => {
      lastLinesRef.current = null;
      if (bulletsRef.current.length === 0) scheduleProject();
    });
    ro.observe(stage);

    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
    };
  }, [active, scheduleProject]);

  const setWrapperRef = useCallback((el: HTMLDivElement | null) => {
    wrapperRef.current = el;
  }, []);

  const setStageRef = useCallback((el: HTMLDivElement | null) => {
    if (el === null) {
      for (const span of poolRef.current) {
        span.remove();
      }
      poolRef.current = [];
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (bulletLoopRef.current !== null) {
        cancelAnimationFrame(bulletLoopRef.current);
        bulletLoopRef.current = null;
      }
      bulletsRef.current = [];
      preparedRef.current = null;
      lastLinesRef.current = null;
      stageRef.current = null;
      return;
    }
    stageRef.current = el;
  }, []);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div ref={setWrapperRef} className="relative w-full min-h-[4.5rem]">
      <div
        ref={setStageRef}
        className={stageClassName ?? "relative w-full text-lg leading-8"}
        role="presentation"
      />
      <div
        ref={bulletsOverlayRef}
        className="pointer-events-none absolute inset-0 z-[5] overflow-visible"
        aria-hidden
      />
    </div>
  );
}
