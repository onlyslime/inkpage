/**
 * 规范站点根 URL（用于 metadataBase、绝对链接等）。
 *
 * - 生产：默认 `https://example.com`（请替换为你的自定义域名）。
 * - 本地：可在 `.env.local` 中设置 `NEXT_PUBLIC_SITE_URL=http://localhost:3000`。
 * - 部署平台：建议在面板里为「生产环境」设置 `NEXT_PUBLIC_SITE_URL=https://your-domain.com`。
 */
export const DEFAULT_SITE_URL = "https://example.com";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  // Vercel 预览/生产在未显式配置域名时，用当前部署主机名（含 *.vercel.app）
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return DEFAULT_SITE_URL;
}
