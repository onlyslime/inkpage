import type { Metadata } from "next";
import { SettingsPageClient } from "./SettingsPageClient";

export const metadata: Metadata = {
  title: "设置",
  description: "Settings — UI theme",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
