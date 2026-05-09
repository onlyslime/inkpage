import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadProjectFile, listProjectSlugs } from "@/lib/projectDetailLoad";
import { ProjectDetailClient } from "./ProjectDetailClient";

export function generateStaticParams() {
  return listProjectSlugs().map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const file = loadProjectFile(slug);
  if (!file) return { title: "项目" };
  const desc = file.zh.metaDescription.trim() || file.displayName;
  return {
    title: file.displayName,
    description: desc,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const file = loadProjectFile(slug);
  if (!file) notFound();

  return (
    <ProjectDetailClient
      slug={slug}
      bilingual={{ zh: file.zh, en: file.en }}
      displayName={file.displayName}
    />
  );
}
