/** localStorage 键，与 ThemeProvider 模式一致 */
export const FONT_STORAGE_KEY = "site-font-choice";

export const FONT_IDS = [
  "geist",
  "system",
  "serif",
  "mono",
  "wenkai",
  "pixel",
] as const;
export type FontId = (typeof FONT_IDS)[number];

export const DEFAULT_FONT_ID: FontId = "wenkai";

export function isFontId(value: string): value is FontId {
  return (FONT_IDS as readonly string[]).includes(value);
}
