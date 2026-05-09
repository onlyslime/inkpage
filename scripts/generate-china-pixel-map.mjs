/**
 * Rasterize DataV province GeoJSON → main China pixel grid + HK/Macau inset grid.
 * Run: node scripts/generate-china-pixel-map.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "data/life/china-provinces-full.json");
const OUT = path.join(ROOT, "app/life/chinaPixelMap.generated.ts");

/**
 * 主图：越细越像真实省界，但 DOM 方块数会增大。
 * ROWS 相对 COLS 略大，画幅更高，避免整体过扁（等经纬采样下略偏竖长观感）。
 */
const COLS = 192;
const ROWS = 168;
const CELL_PX = 3;

/** 左下角「港澳」插图：单独 bbox 放大；略小以免挡主图陆地标注 */
const INSET_COLS = 52;
const INSET_ROWS = 40;
const INSET_CELL_PX = 3;

function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolygon(lng, lat, rings) {
  if (!pointInRing(lng, lat, rings[0])) return false;
  for (let h = 1; h < rings.length; h++) {
    if (pointInRing(lng, lat, rings[h])) return false;
  }
  return true;
}

function pointInMultiPolygon(lng, lat, multiCoords) {
  for (const poly of multiCoords) {
    if (pointInPolygon(lng, lat, poly)) return true;
  }
  return false;
}

function boundsFromGeoJSON(fc) {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const f of fc.features) {
    const g = f.geometry;
    if (!g) continue;
    const collect = (coords) => {
      if (typeof coords[0] === "number") {
        const [lng, lat] = coords;
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      } else {
        for (const c of coords) collect(c);
      }
    };
    collect(g.coordinates);
  }
  return { minLng, maxLng, minLat, maxLat };
}

function pointInFeature(lng, lat, f) {
  const g = f.geometry;
  if (g.type === "Polygon") {
    return pointInPolygon(lng, lat, g.coordinates);
  }
  if (g.type === "MultiPolygon") {
    return pointInMultiPolygon(lng, lat, g.coordinates);
  }
  return false;
}

/**
 * @param {typeof import("geojson").Feature[]} feats
 * @param {{ minLng: number; maxLng: number; minLat: number; maxLat: number }} bbox
 * @param {number} cols
 * @param {number} rows
 */
function rasterize(feats, bbox, cols, rows) {
  const { minLng, maxLng, minLat, maxLat } = bbox;
  const dLng = maxLng - minLng;
  const dLat = maxLat - minLat;
  const grid = new Array(cols * rows).fill(0);

  for (let row = 0; row < rows; row++) {
    const lat = maxLat - ((row + 0.5) / rows) * dLat;
    for (let col = 0; col < cols; col++) {
      const lng = minLng + ((col + 0.5) / cols) * dLng;
      let hit = 0;
      for (const f of feats) {
        const adcode = f.properties.adcode;
        if (pointInFeature(lng, lat, f)) {
          hit = adcode;
          break;
        }
      }
      grid[row * cols + col] = hit;
    }
  }
  return grid;
}

function padBBox(b, relPad) {
  const dLng = b.maxLng - b.minLng;
  const dLat = b.maxLat - b.minLat;
  const px = dLng * relPad;
  const py = dLat * relPad;
  return {
    minLng: b.minLng - px,
    maxLng: b.maxLng + px,
    minLat: b.minLat - py,
    maxLat: b.maxLat + py,
  };
}

function buildKeyGrid(grid) {
  const unique = [...new Set(grid.filter((x) => x > 0))].sort((a, b) => a - b);
  const adcodeToKey = new Map();
  unique.forEach((ad, i) => adcodeToKey.set(ad, i + 1));
  const keyToAdcode = [0, ...unique];
  const keys = grid.map((ad) => (ad ? adcodeToKey.get(ad) ?? 0 : 0));
  return { keys, keyToAdcode, unique };
}

function labelRowsFromGrid(grid, cols, rows, cellPx, unique, labelByAd) {
  const sums = new Map();
  const counts = new Map();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const ad = grid[row * cols + col];
      if (!ad) continue;
      counts.set(ad, (counts.get(ad) ?? 0) + 1);
      const s = sums.get(ad) ?? { cx: 0, cy: 0 };
      s.cx += col + 0.5;
      s.cy += row + 0.5;
      sums.set(ad, s);
    }
  }

  const labelRows = [];
  for (const ad of unique) {
    const s = sums.get(ad);
    const n = counts.get(ad);
    if (!s || !n) continue;
    const cx = (s.cx / n) * cellPx;
    const cy = (s.cy / n) * cellPx;
    const ch = labelByAd[ad];
    if (!ch) continue;
    labelRows.push(
      `    { adcode: ${ad}, label: ${JSON.stringify(ch)}, x: ${cx.toFixed(2)}, y: ${cy.toFixed(2)} },`,
    );
  }
  labelRows.sort();
  return labelRows;
}

function main() {
  const raw = fs.readFileSync(SRC, "utf8");
  const fc = JSON.parse(raw);
  const feats = fc.features.filter(
    (f) => f.properties?.level === "province" && f.geometry,
  );

  const chinaBbox = boundsFromGeoJSON({
    type: "FeatureCollection",
    features: feats,
  });

  const mainGrid = rasterize(feats, chinaBbox, COLS, ROWS);
  const mainPacked = buildKeyGrid(mainGrid);
  const mainLabelRows = labelRowsFromGrid(
    mainGrid,
    COLS,
    ROWS,
    CELL_PX,
    mainPacked.unique,
    labelByAd,
  );

  /** 港澳优先命中，避免被粤多边形抢先 */
  const hkMacFeats = feats.filter((f) =>
    [810000, 820000].includes(f.properties.adcode),
  );
  if (hkMacFeats.length === 0) {
    throw new Error("GeoJSON missing Hong Kong or Macau (810000/820000)");
  }
  const hkMacBboxRaw = boundsFromGeoJSON({
    type: "FeatureCollection",
    features: hkMacFeats,
  });
  const insetBbox = padBBox(hkMacBboxRaw, 0.22);

  const featOrderInset = [...feats].sort((a, b) => {
    const aHm = [810000, 820000].includes(a.properties.adcode) ? 0 : 1;
    const bHm = [810000, 820000].includes(b.properties.adcode) ? 0 : 1;
    if (aHm !== bHm) return aHm - bHm;
    return a.properties.adcode - b.properties.adcode;
  });

  const insetGrid = rasterize(featOrderInset, insetBbox, INSET_COLS, INSET_ROWS);
  const insetPacked = buildKeyGrid(insetGrid);
  const insetLabelRows = labelRowsFromGrid(
    insetGrid,
    INSET_COLS,
    INSET_ROWS,
    INSET_CELL_PX,
    insetPacked.unique,
    labelByAd,
  );

  const ts = `/* eslint-disable */
/**
 * AUTO-GENERATED by scripts/generate-china-pixel-map.mjs — do not edit by hand.
 * Source: data/life/china-provinces-full.json (DataV provinces)
 */
export const CHINA_PIXEL_COLS = ${COLS} as const;
export const CHINA_PIXEL_ROWS = ${ROWS} as const;
export const CHINA_PIXEL_CELL_PX = ${CELL_PX} as const;

/** palette index 0 = empty/ocean; 1..N = province bucket */
export const CHINA_PIXEL_KEY_TO_ADCODE: readonly number[] = [${mainPacked.keyToAdcode.join(", ")}];

/** row-major, length ${COLS * ROWS} */
export const CHINA_PIXEL_KEYS = new Uint8Array([${mainPacked.keys.join(", ")}]);

export type PixelLabel = { adcode: number; label: string; x: number; y: number };

/** centroid of raster cells per province, in SVG px */
export const CHINA_PIXEL_LABELS: readonly PixelLabel[] = [
${mainLabelRows.join("\n")}
];

/** 港澳放大图（像素格，独立 bbox；组件中置于左下角以免挡东南沿海） */
export const CHINA_INSET_COLS = ${INSET_COLS} as const;
export const CHINA_INSET_ROWS = ${INSET_ROWS} as const;
export const CHINA_INSET_CELL_PX = ${INSET_CELL_PX} as const;

export const CHINA_INSET_KEY_TO_ADCODE: readonly number[] = [${insetPacked.keyToAdcode.join(", ")}];

export const CHINA_INSET_KEYS = new Uint8Array([${insetPacked.keys.join(", ")}]);

/** 插图内省名质心（相对插图左下角内容区 0,0） */
export const CHINA_INSET_LABELS: readonly PixelLabel[] = [
${insetLabelRows.join("\n")}
];
`;

  fs.writeFileSync(OUT, ts, "utf8");
  console.log(
    "Wrote",
    OUT,
    "main provinces",
    mainPacked.unique.length,
    "cells",
    mainPacked.keys.length,
    "inset provinces",
    insetPacked.unique.length,
    "inset cells",
    insetPacked.keys.length,
  );
}

const labelByAd = Object.fromEntries([
  [110000, "京"],
  [120000, "津"],
  [130000, "冀"],
  [140000, "晋"],
  [150000, "蒙"],
  [210000, "辽"],
  [220000, "吉"],
  [230000, "黑"],
  [310000, "沪"],
  [320000, "苏"],
  [330000, "浙"],
  [340000, "皖"],
  [350000, "闽"],
  [360000, "赣"],
  [370000, "鲁"],
  [410000, "豫"],
  [420000, "鄂"],
  [430000, "湘"],
  [440000, "粤"],
  [450000, "桂"],
  [460000, "琼"],
  [500000, "渝"],
  [510000, "川"],
  [520000, "黔"],
  [530000, "云"],
  [540000, "藏"],
  [610000, "陕"],
  [620000, "甘"],
  [630000, "青"],
  [640000, "宁"],
  [650000, "新"],
  [710000, "台"],
  [810000, "港"],
  [820000, "澳"],
]);

main();
