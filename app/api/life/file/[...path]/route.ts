import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { isDownloadAuthorized } from "@/lib/downloadAuth";

const ROOT = path.join(process.cwd(), "data", "life_photos");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".json": "application/json",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!isDownloadAuthorized(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const { path: segments } = await context.params;
  if (!segments?.length) {
    return new NextResponse(null, { status: 404 });
  }

  const joined = path.join(ROOT, ...segments);
  const resolved = path.resolve(joined);
  const rootResolved = path.resolve(ROOT);
  if (!resolved.startsWith(rootResolved + path.sep) && resolved !== rootResolved) {
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

  const buf = await fs.readFile(resolved);
  return new NextResponse(buf, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
