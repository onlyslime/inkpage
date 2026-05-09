import fs from "fs";
import path from "path";

export type BlogIndexItem = {
  /** YYYY-MM-DD */
  date: string;
  year: number;
  title: string;
  /** `/blog/...` path, slug segment already encoded for URL */
  href: string;
};

const BLOG_ROOT = path.join(process.cwd(), "data", "blogs");

function extractTitle(markdown: string, filenameFallback: string): string {
  const m = markdown.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  return filenameFallback;
}

/**
 * Recursively collect `data/blogs/YYYY/M/D/*.md` posts.
 */
function walk(
  dir: string,
  relSegments: string[],
  out: BlogIndexItem[],
): void {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, [...relSegments, name], out);
    } else if (/\.md$/i.test(name)) {
      if (relSegments.length < 3) continue;
      const [y, mo, d] = relSegments;
      const year = parseInt(y, 10);
      const month = parseInt(mo, 10);
      const day = parseInt(d, 10);
      if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day))
        continue;
      const date = `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const base = name.replace(/\.md$/i, "");
      const raw = fs.readFileSync(full, "utf-8");
      const title = extractTitle(raw, base);
      const href = `/blog/${y}/${mo}/${d}/${encodeURIComponent(base)}`;
      out.push({ date, year, title, href });
    }
  }
}

let cached: BlogIndexItem[] | null = null;

/**
 * All posts, newest first. Safe to call from Server Components / generateMetadata.
 */
export function getBlogIndex(): BlogIndexItem[] {
  if (process.env.NODE_ENV === "production" && cached) return cached;
  const out: BlogIndexItem[] = [];
  walk(BLOG_ROOT, [], out);
  out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  if (process.env.NODE_ENV === "production") cached = out;
  return out;
}

export function getBlogPostFilePath(
  year: string,
  month: string,
  day: string,
  slug: string,
): string | null {
  const decoded = decodeURIComponent(slug);
  const filePath = path.join(
    process.cwd(),
    "data",
    "blogs",
    year,
    month,
    day,
    `${decoded}.md`,
  );
  if (!fs.existsSync(filePath)) return null;
  return filePath;
}

export function readBlogPostMarkdown(filePath: string): {
  title: string;
  body: string;
} {
  const raw = fs.readFileSync(filePath, "utf-8");
  const title = extractTitle(raw, path.basename(filePath, ".md"));
  const body = raw.replace(/^#\s+.+\n+/, "").trimStart();
  return { title, body: body.trim() };
}

/**
 * 将正文 Markdown 转为纯文本，供灵动模式 Pretext 与可见内容大致对齐（不含文章一级标题）。
 */
export function markdownBodyToLivelyPlain(md: string): string {
  let s = md.replace(/\r\n/g, "\n").trim();
  s = s.replace(/^###\s+(.+)$/gm, "$1\n\n");
  s = s.replace(/^##\s+(.+)$/gm, "$1\n\n");
  s = s.replace(/^#\s+(.+)$/gm, "$1\n\n");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/^\d+\.\s+(.+)$/gm, "$1\n");
  s = s.replace(/^[-*]\s+(.+)$/gm, "• $1\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}
