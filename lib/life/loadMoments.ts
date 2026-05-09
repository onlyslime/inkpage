import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type { MomentMeta, MomentRecord } from "./types";
const MOMENTS_ROOT = path.join(
  process.cwd(),
  "data",
  "life_photos",
  "moments",
);

function parseSlot(name: string): number {
  const n = Number.parseInt(name, 10);
  return Number.isFinite(n) ? n : 0;
}

/** 目录日期 + 序号推断 createdAt（当日 12:00 上海） */
function fallbackDateFromPath(
  year: number,
  month: number,
  day: number,
  slot: number,
): Date {
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00:00`;
  return new Date(`${iso}+08:00`);
}

export async function loadMoments(): Promise<MomentRecord[]> {
  const out: MomentRecord[] = [];
  let years: string[] = [];
  try {
    years = await fs.readdir(MOMENTS_ROOT);
  } catch {
    return [];
  }

  for (const y of years) {
    if (!/^\d{4}$/.test(y)) continue;
    const year = Number(y);
    const yPath = path.join(MOMENTS_ROOT, y);
    let months: string[] = [];
    try {
      months = await fs.readdir(yPath);
    } catch {
      continue;
    }
    for (const m of months) {
      if (!/^\d{1,2}$/.test(m)) continue;
      const month = Number(m);
      const mPath = path.join(yPath, m);
      let days: string[] = [];
      try {
        days = await fs.readdir(mPath);
      } catch {
        continue;
      }
      for (const d of days) {
        if (!/^\d{1,2}$/.test(d)) continue;
        const day = Number(d);
        const dPath = path.join(mPath, d);
        let slots: string[] = [];
        try {
          slots = await fs.readdir(dPath);
        } catch {
          continue;
        }
        const sortedSlots = [...slots].sort(
          (a, b) => parseSlot(a) - parseSlot(b),
        );
        for (const slot of sortedSlots) {
          const slotPath = path.join(dPath, slot);
          let stat;
          try {
            stat = await fs.stat(slotPath);
          } catch {
            continue;
          }
          if (!stat.isDirectory()) continue;
          const metaPath = path.join(slotPath, "meta.json");
          let raw: string;
          try {
            raw = await fs.readFile(metaPath, "utf8");
          } catch {
            continue;
          }
          let meta: MomentMeta;
          try {
            meta = JSON.parse(raw) as MomentMeta;
          } catch {
            continue;
          }
          if (!Array.isArray(meta.images)) meta.images = [];
          const relDir = path.posix.join(
            "moments",
            y,
            String(month),
            String(day),
            slot,
          );

          let publishAtDate: Date | null = null;
          if (meta.publishAt) {
            const p = new Date(meta.publishAt);
            if (!Number.isNaN(p.getTime())) {
              if (p.getTime() > Date.now()) {
                continue;
              }
              publishAtDate = p;
            }
          }

          let baseCreated: Date;
          if (meta.createdAt) {
            baseCreated = new Date(meta.createdAt);
            if (Number.isNaN(baseCreated.getTime())) {
              baseCreated = fallbackDateFromPath(
                year,
                month,
                day,
                parseSlot(slot),
              );
            }
          } else {
            baseCreated = fallbackDateFromPath(
              year,
              month,
              day,
              parseSlot(slot),
            );
          }

          const createdAt = publishAtDate ?? baseCreated;
          out.push({ relDir, meta, createdAt });
        }
      }
    }
  }

  out.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return out;
}

/** 供客户端展示的序列化条目 */
export type MomentDTO = {
  relDir: string;
  createdAt: string;
  text: string;
  images: string[];
};

export function toMomentDTO(m: MomentRecord): MomentDTO {
  return {
    relDir: m.relDir,
    createdAt: m.createdAt.toISOString(),
    text: m.meta.text,
    images: m.meta.images,
  };
}
