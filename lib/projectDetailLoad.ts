import fs from "fs";
import path from "path";

import type { ProjectDetail } from "./projectDetailCopy";
import { displayNameFromSlug } from "./projects";

export type ProjectDetailBilingual = {
  zh: ProjectDetail;
  en: ProjectDetail;
};

export type LoadedProjectFile = {
  /** Optional root field in JSON; otherwise derived from slug */
  displayName: string;
  zh: ProjectDetail;
  en: ProjectDetail;
};

function isProjectDetail(x: unknown): x is ProjectDetail {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.metaDescription !== "string") return false;
  if (!Array.isArray(o.sections)) return false;
  return true;
}

const PROJECTS_DIR = path.join(process.cwd(), "data", "projects");

let cachedEntries: { slug: string; name: string }[] | null = null;

/** `data/projects/<slug>/<slug>.json` */
function projectDetailJsonPath(slug: string): string {
  return path.join(PROJECTS_DIR, slug, `${slug}.json`);
}

/**
 * Reads `data/projects/<slug>/<slug>.json` (optional `displayName` + zh + en).
 * Server-only (uses fs); call from Server Components or generateMetadata.
 * 同目录可放介绍视频等素材，经 `/api/projects/asset/<slug>/...` 访问。
 */
export function loadProjectFile(slug: string): LoadedProjectFile | null {
  const filePath = projectDetailJsonPath(slug);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (!isProjectDetail(o.zh) || !isProjectDetail(o.en)) return null;
    const dn =
      typeof o.displayName === "string" && o.displayName.trim() !== ""
        ? o.displayName.trim()
        : displayNameFromSlug(slug);
    return { displayName: dn, zh: o.zh, en: o.en };
  } catch {
    return null;
  }
}

/**
 * Reads project detail (zh + en). Returns null if missing or invalid.
 */
export function loadProjectDetailBilingual(
  slug: string,
): ProjectDetailBilingual | null {
  const f = loadProjectFile(slug);
  if (!f) return null;
  return { zh: f.zh, en: f.en };
}

/**
 * 扫描 `data/projects` 下子目录：每个 `slug/` 内需存在 `slug/slug.json`。
 * 忽略以 `_` 开头的目录名；根目录散落文件不参与列表。
 */
export function listProjectEntries(): { slug: string; name: string }[] {
  if (process.env.NODE_ENV === "production" && cachedEntries) return cachedEntries;

  if (!fs.existsSync(PROJECTS_DIR)) {
    const empty: { slug: string; name: string }[] = [];
    if (process.env.NODE_ENV === "production") cachedEntries = empty;
    return empty;
  }

  const entries: { slug: string; name: string }[] = [];
  for (const dirent of fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const slug = dirent.name;
    if (slug.startsWith("_")) continue;
    const loaded = loadProjectFile(slug);
    if (!loaded) continue;
    entries.push({ slug, name: loaded.displayName });
  }

  entries.sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  );

  if (process.env.NODE_ENV === "production") cachedEntries = entries;
  return entries;
}

export function listProjectSlugs(): string[] {
  return listProjectEntries().map((e) => e.slug);
}
