import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const ROOT = path.join(process.cwd(), "data", "life_photos", "moments");
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function authOk(request: Request): boolean {
  const secret = process.env.LIFE_POST_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7) === secret;
  }
  return false;
}

function shanghaiYmd(d: Date): { yStr: string; mFold: string; dFold: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(d);
  const yStr = parts.find((p) => p.type === "year")?.value ?? "1970";
  const mNum = Number(parts.find((p) => p.type === "month")?.value ?? "1");
  const dNum = Number(parts.find((p) => p.type === "day")?.value ?? "1");
  return {
    yStr,
    mFold: String(mNum).padStart(2, "0"),
    dFold: String(dNum).padStart(2, "0"),
  };
}

export async function POST(request: Request) {
  if (!authOk(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const text = String(form.get("text") ?? "").trim();
  const files = form.getAll("images").filter((x): x is File => x instanceof File);

  if (!text && files.length === 0) {
    return NextResponse.json(
      { error: "text or images required" },
      { status: 400 },
    );
  }
  if (files.length > 9) {
    return NextResponse.json({ error: "max 9 images" }, { status: 400 });
  }

  const now = new Date();
  const publishAtRaw = String(form.get("publishAt") ?? "").trim();

  let refDate = now;
  let publishAtIso: string | undefined;

  if (publishAtRaw) {
    const publishAt = new Date(publishAtRaw);
    if (Number.isNaN(publishAt.getTime())) {
      return NextResponse.json({ error: "invalid publishAt" }, { status: 400 });
    }
    if (publishAt.getTime() <= now.getTime()) {
      return NextResponse.json(
        { error: "publishAt must be in the future" },
        { status: 400 },
      );
    }
    if (publishAt.getTime() > now.getTime() + SEVEN_DAYS_MS) {
      return NextResponse.json(
        { error: "publishAt must be within 7 days" },
        { status: 400 },
      );
    }
    refDate = publishAt;
    publishAtIso = publishAt.toISOString();
  }

  const { yStr, mFold, dFold } = shanghaiYmd(refDate);
  const dayDir = path.join(ROOT, yStr, mFold, dFold);
  await fs.mkdir(dayDir, { recursive: true });

  let entries: string[] = [];
  try {
    entries = await fs.readdir(dayDir);
  } catch {
    entries = [];
  }
  const nums = entries
    .map((name) => Number.parseInt(name, 10))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  const slot = String(next);
  const slotDir = path.join(dayDir, slot);
  await fs.mkdir(slotDir, { recursive: true });

  const imageNames: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const ext = path.extname(file.name) || ".jpg";
    const name = `${i + 1}${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(slotDir, name), buf);
    imageNames.push(name);
  }

  const createdAt = now.toISOString();
  const meta: Record<string, unknown> = {
    text,
    images: imageNames,
    createdAt,
  };
  if (publishAtIso) {
    meta.publishAt = publishAtIso;
  }
  await fs.writeFile(
    path.join(slotDir, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf8",
  );

  return NextResponse.json({
    ok: true,
    path: path.posix.join("moments", yStr, mFold, dFold, slot),
    scheduled: Boolean(publishAtIso),
    publishAt: publishAtIso ?? null,
  });
}
