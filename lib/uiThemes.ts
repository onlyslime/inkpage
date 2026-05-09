/**
 * 与 awesome-design-md 集合对应的 UI 主题 id（10 套）。
 * 详细色板说明见 app/globals.css 顶部注释；完整 DESIGN.md 可从 getdesign.md 查阅。
 */
export const THEME_IDS = [
  "vercel",
  "linear",
  "cursor",
  "notion",
  "stripe",
  "supabase",
  "ollama",
  "raycast",
  "claude",
  "resend",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME_ID: ThemeId = "claude";

export const THEME_STORAGE_KEY = "personal-site-ui-theme";

export function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value);
}
