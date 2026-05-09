import type { Metadata } from "next";
import { IntroPageClient } from "./IntroPageClient";

export const metadata: Metadata = {
  title: "介绍",
  description: "About Your Name",
};

export default function IntroPage() {
  return <IntroPageClient />;
}
