import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type { FootprintMap } from "./footprint";

const ROOT = path.join(process.cwd(), "data", "life_photos", "footprint.json");

export async function loadFootprint(): Promise<FootprintMap> {
  try {
    const raw = await fs.readFile(ROOT, "utf8");
    return JSON.parse(raw) as FootprintMap;
  } catch {
    return {};
  }
}
