"use client";

import { useMemo, type ReactNode } from "react";

import {
  visitForAdcode,
  type FootprintMap,
  type FootprintVisit,
} from "@/lib/life/footprint";
import {
  CHINA_INSET_CELL_PX,
  CHINA_INSET_COLS,
  CHINA_INSET_KEYS,
  CHINA_INSET_KEY_TO_ADCODE,
  CHINA_INSET_LABELS,
  CHINA_INSET_ROWS,
  CHINA_PIXEL_CELL_PX,
  CHINA_PIXEL_COLS,
  CHINA_PIXEL_KEYS,
  CHINA_PIXEL_KEY_TO_ADCODE,
  CHINA_PIXEL_LABELS,
  CHINA_PIXEL_ROWS,
} from "./chinaPixelMap.generated";

const INSET_FRAME_PAD = 6;
const INSET_TITLE_H = 14;
const INSET_MARGIN = 8;

/** 栅格化省级边界后的像素填色；海域 */
const OCEAN_FILL = "#e8eef5";

/** 固定十六进制：不依赖 Tailwind 类、CSS 变量或 color-mix */
const FILL: Record<FootprintVisit, string> = {
  none: "#e2e8f0", // slate-200
  plan: "#16a34a", // green-600
  long: "#dc2626", // red-600
  tour: "#d97706", // amber-600
  pass: "#2563eb", // blue-600
};

const LABEL_LIGHT = "#f1f5f9";
const LABEL_DARK = "#374151";

function textColor(v: FootprintVisit): string {
  return v === "none" ? LABEL_DARK : LABEL_LIGHT;
}

type Props = { footprint: FootprintMap };

export function ChinaFootprintMap({ footprint }: Props) {
  const viewW = CHINA_PIXEL_COLS * CHINA_PIXEL_CELL_PX;
  const viewH = CHINA_PIXEL_ROWS * CHINA_PIXEL_CELL_PX;

  const insetInnerW = CHINA_INSET_COLS * CHINA_INSET_CELL_PX;
  const insetInnerH = CHINA_INSET_ROWS * CHINA_INSET_CELL_PX;
  const insetFrameW = insetInnerW + INSET_FRAME_PAD * 2;
  const insetFrameH =
    INSET_TITLE_H + INSET_FRAME_PAD + insetInnerH + INSET_FRAME_PAD;
  /** 左下角：避免盖住主图右下的粤、闽等沿海省 */
  const insetOriginX = INSET_MARGIN;
  const insetOriginY = viewH - insetFrameH - INSET_MARGIN;

  const pixels = useMemo(() => {
    const out: ReactNode[] = [];
    for (let i = 0; i < CHINA_PIXEL_KEYS.length; i++) {
      const key = CHINA_PIXEL_KEYS[i]!;
      const col = i % CHINA_PIXEL_COLS;
      const row = Math.floor(i / CHINA_PIXEL_COLS);
      const x = col * CHINA_PIXEL_CELL_PX;
      const y = row * CHINA_PIXEL_CELL_PX;
      let fill: string;
      if (key === 0) {
        fill = OCEAN_FILL;
      } else {
        const adcode = CHINA_PIXEL_KEY_TO_ADCODE[key]!;
        const v = visitForAdcode(footprint, adcode);
        fill = FILL[v];
      }
      out.push(
        <rect
          key={i}
          x={x}
          y={y}
          width={CHINA_PIXEL_CELL_PX}
          height={CHINA_PIXEL_CELL_PX}
          fill={fill}
        />,
      );
    }
    return out;
  }, [footprint]);

  const insetPixels = useMemo(() => {
    const out: ReactNode[] = [];
    for (let i = 0; i < CHINA_INSET_KEYS.length; i++) {
      const key = CHINA_INSET_KEYS[i]!;
      const col = i % CHINA_INSET_COLS;
      const row = Math.floor(i / CHINA_INSET_COLS);
      const x = col * CHINA_INSET_CELL_PX;
      const y = row * CHINA_INSET_CELL_PX;
      let fill: string;
      if (key === 0) {
        fill = OCEAN_FILL;
      } else {
        const adcode = CHINA_INSET_KEY_TO_ADCODE[key]!;
        const v = visitForAdcode(footprint, adcode);
        fill = FILL[v];
      }
      out.push(
        <rect
          key={`inset-${i}`}
          x={x}
          y={y}
          width={CHINA_INSET_CELL_PX}
          height={CHINA_INSET_CELL_PX}
          fill={fill}
        />,
      );
    }
    return out;
  }, [footprint]);

  const insetLabelFont = Math.max(
    7,
    Math.min(11, CHINA_INSET_CELL_PX * 2.8),
  );

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      className="mx-auto w-full max-w-2xl border border-border"
      style={{ background: "var(--card)" }}
      shapeRendering="crispEdges"
      role="img"
      aria-label="中国各省足迹"
    >
      {pixels}
      {CHINA_PIXEL_LABELS.map((L) => {
        const v = visitForAdcode(footprint, L.adcode);
        const tc = textColor(v);
        return (
          <text
            key={L.adcode}
            x={L.x}
            y={L.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={Math.max(6, Math.min(9, CHINA_PIXEL_CELL_PX * 2.5))}
            fill={tc}
            style={{
              userSelect: "none",
              pointerEvents: "none",
              shapeRendering: "geometricPrecision",
            }}
          >
            {L.label}
          </text>
        );
      })}
      <g transform={`translate(${insetOriginX},${insetOriginY})`}>
        <rect
          x={0}
          y={0}
          width={insetFrameW}
          height={insetFrameH}
          rx={2}
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth={1}
        />
        <text
          x={insetFrameW / 2}
          y={INSET_TITLE_H * 0.72}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={10}
          fill="var(--muted-foreground)"
          style={{
            userSelect: "none",
            pointerEvents: "none",
            shapeRendering: "geometricPrecision",
          }}
        >
          港澳
        </text>
        <g
          transform={`translate(${INSET_FRAME_PAD},${INSET_TITLE_H + INSET_FRAME_PAD})`}
          shapeRendering="crispEdges"
        >
          {insetPixels}
          {CHINA_INSET_LABELS.map((L) => {
            const v = visitForAdcode(footprint, L.adcode);
            const tc = textColor(v);
            return (
              <text
                key={`inset-label-${L.adcode}`}
                x={L.x}
                y={L.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={insetLabelFont}
                fill={tc}
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                  shapeRendering: "geometricPrecision",
                }}
              >
                {L.label}
              </text>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
