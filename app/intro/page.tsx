import type { Metadata } from "next";
import { IntroPageClient } from "./IntroPageClient";

export const metadata: Metadata = {
  title: "介绍",
  description: "墨站 · 个人网页框架",
};

export default function IntroPage() {
  return <IntroPageClient />;
}
