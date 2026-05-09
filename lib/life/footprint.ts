import type { FeatureCollection, Feature } from "geojson";

export type FootprintVisit = "none" | "plan" | "pass" | "tour" | "long";

/** adcode 字符串，如 "110000" */
export type FootprintMap = Partial<Record<string, FootprintVisit>>;

export const FOOTPRINT_WEIGHT: Record<FootprintVisit, number> = {
  none: 0,
  plan: 0,
  pass: 1,
  tour: 3,
  long: 5,
};

export function scoreFootprint(map: FootprintMap): number {
  let s = 0;
  for (const v of Object.values(map)) {
    if (v && v in FOOTPRINT_WEIGHT) {
      s += FOOTPRINT_WEIGHT[v];
    }
  }
  return s;
}

export function visitForAdcode(
  map: FootprintMap,
  adcode: number,
): FootprintVisit {
  const key = String(adcode);
  return map[key] ?? "none";
}

export function isProvinceFeature(f: Feature): boolean {
  const p = f.properties as Record<string, unknown> | null;
  return p?.level === "province";
}

export function filterProvinceFeatures(
  fc: FeatureCollection,
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: fc.features.filter(isProvinceFeature),
  };
}
