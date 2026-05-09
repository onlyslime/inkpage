import { NextResponse } from "next/server";
import { SITE_PASSWORD, SITE_ACCESS_KEY } from "@/lib/serverAuth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const ok =
      typeof body.password === "string" &&
      body.password.trim() === SITE_PASSWORD &&
      SITE_PASSWORD !== "";
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const ok =
    typeof key === "string" &&
    key.trim() === SITE_ACCESS_KEY &&
    SITE_ACCESS_KEY !== "";
  return NextResponse.json({ ok });
}
