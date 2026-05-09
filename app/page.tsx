import type { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "Home",
  description: "Your Name's personal site",
};

export default function HomePage() {
  return <HomePageClient />;
}
