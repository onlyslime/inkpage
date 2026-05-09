/**
 * 项目列表由 `data/projects/<slug>/` 子目录自动发现（需存在 `<slug>/<slug>.json`，见 `listProjectEntries`），不再在此硬编码 slug 集合。
 */

/** 当 JSON 根级未设置 `displayName` 时，用 slug 生成展示名 */
export function displayNameFromSlug(slug: string): string {
  if (!slug) return "Project";
  return slug
    .split("-")
    .map((w) =>
      w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : "",
    )
    .join(" ");
}
