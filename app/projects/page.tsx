import type { Metadata } from "next";
import { listProjectEntries } from "@/lib/projectDetailLoad";
import { ProjectsPageClient } from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "项目",
  description: "Projects",
};

export default function ProjectsPage() {
  const items = listProjectEntries();
  return <ProjectsPageClient items={items} />;
}
