import type { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "墨站",
  description: "墨站 · 个人网页框架",
};

export default function HomePage() {
  return <HomePageClient />;
}
