import type { Metadata } from "next";

import { loadFootprint } from "@/lib/life/loadFootprint";
import { loadMoments, toMomentDTO } from "@/lib/life/loadMoments";

import { LifePageClient } from "./LifePageClient";

/** 定时动态到点后需在请求时重新过滤，不可静态预渲染 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "生活",
  description: "Moments · footprint · feed",
};

export default async function LifePage() {
  const footprint = await loadFootprint();
  const moments = (await loadMoments()).map(toMomentDTO);

  return (
    <LifePageClient footprint={footprint} moments={moments} />
  );
}
