import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { isDownloadAuthorized } from "@/lib/downloadAuth";

const PROJECTS_ROOT = path.join(process.cwd(), "data", "projects");

const MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".json": "application/json",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string; path: string[] }> },
) {
  if (!isDownloadAuthorized(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const { slug, path: segments } = await context.params;
  if (!slug || slug.startsWith("_") || !segments?.length) {
    return new NextResponse(null, { status: 404 });
  }

  const projectRoot = path.join(PROJECTS_ROOT, slug);
  const projectRootResolved = path.resolve(projectRoot);
  const rootResolved = path.resolve(PROJECTS_ROOT);
  if (
    !projectRootResolved.startsWith(rootResolved + path.sep) &&
    projectRootResolved !== rootResolved
  ) {
    return new NextResponse(null, { status: 403 });
  }

  const joined = path.join(projectRoot, ...segments);
  const resolved = path.resolve(joined);
  if (
    !resolved.startsWith(projectRootResolved + path.sep) &&
    resolved !== projectRootResolved
  ) {
    return new NextResponse(null, { status: 403 });
  }

  let stat;
  try {
    stat = await fs.stat(resolved);
  } catch {
    return new NextResponse(null, { status: 404 });
  }
  if (!stat.isFile()) {
    return new NextResponse(null, { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const filename = path.basename(resolved);
  const isAttachment =
    contentType === "application/pdf" || contentType.startsWith("video/");
  const disposition = isAttachment ? "attachment" : "inline";

  const buf = await fs.readFile(resolved);
  return new NextResponse(buf, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
