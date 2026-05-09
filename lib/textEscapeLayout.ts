import {
  layoutNextLine,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";

export type Interval = { left: number; right: number };

export type PositionedLine = {
  x: number;
  y: number;
  width: number;
  text: string;
};

export type CircleObstacle = {
  cx: number;
  cy: number;
  r: number;
  hPad: number;
  vPad: number;
};

export function carveTextLineSlots(
  base: Interval,
  blocked: Interval[],
  minSlotWidth: number,
): Interval[] {
  let slots: Interval[] = [base];
  for (let blockedIndex = 0; blockedIndex < blocked.length; blockedIndex++) {
    const interval = blocked[blockedIndex]!;
    const next: Interval[] = [];
    for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
      const slot = slots[slotIndex]!;
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (interval.left > slot.left)
        next.push({ left: slot.left, right: interval.left });
      if (interval.right < slot.right)
        next.push({ left: interval.right, right: slot.right });
    }
    slots = next;
  }
  return slots.filter((slot) => slot.right - slot.left >= minSlotWidth);
}

export function circleIntervalForBand(
  cx: number,
  cy: number,
  r: number,
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number,
): Interval | null {
  const top = bandTop - vPad;
  const bottom = bandBottom + vPad;
  if (top >= cy + r || bottom <= cy - r) return null;
  const minDy =
    cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom;
  if (minDy >= r) return null;
  const maxDx = Math.sqrt(r * r - minDy * minDy);
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad };
}

const MAX_LINES = 800;

export function layoutTextAroundCircles(
  prepared: PreparedTextWithSegments,
  regionX: number,
  regionY: number,
  regionW: number,
  regionH: number,
  lineHeight: number,
  circles: CircleObstacle[],
  minSlotWidth: number,
): PositionedLine[] {
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  const lines: PositionedLine[] = [];
  let lineTop = regionY;

  while (lineTop + lineHeight <= regionY + regionH && lines.length < MAX_LINES) {
    const bandTop = lineTop;
    const bandBottom = lineTop + lineHeight;
    const blocked: Interval[] = [];

    for (let i = 0; i < circles.length; i++) {
      const c = circles[i]!;
      const interval = circleIntervalForBand(
        c.cx,
        c.cy,
        c.r,
        bandTop,
        bandBottom,
        c.hPad,
        c.vPad,
      );
      if (interval !== null) blocked.push(interval);
    }

    const slots = carveTextLineSlots(
      { left: regionX, right: regionX + regionW },
      blocked,
      minSlotWidth,
    );

    if (slots.length === 0) {
      lineTop += lineHeight;
      continue;
    }

    const orderedSlots = [...slots].sort((a, b) => a.left - b.left);
    let textExhausted = false;

    for (let slotIndex = 0; slotIndex < orderedSlots.length; slotIndex++) {
      const slot = orderedSlots[slotIndex]!;
      const slotWidth = slot.right - slot.left;
      const line = layoutNextLine(prepared, cursor, slotWidth);
      if (line === null) {
        textExhausted = true;
        break;
      }
      lines.push({
        x: Math.round(slot.left),
        y: Math.round(lineTop),
        text: line.text,
        width: line.width,
      });
      cursor = line.end;
    }

    lineTop += lineHeight;
    if (textExhausted) break;
  }

  return lines;
}
