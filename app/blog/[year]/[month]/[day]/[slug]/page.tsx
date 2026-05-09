import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogBackLink } from "@/app/blog/BlogBackLink";
import { BlogPostArticle } from "@/app/blog/BlogPostArticle";
import { PageShell } from "@/app/components/PageShell";
import {
  getBlogIndex,
  getBlogPostFilePath,
  markdownBodyToLivelyPlain,
  readBlogPostMarkdown,
} from "@/lib/blogIndex";

type PageProps = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const filePath = getBlogPostFilePath(year, month, day, slug);
  if (!filePath) return { title: "博客" };
  const { title } = readBlogPostMarkdown(filePath);
  return { title, description: title };
}

export function generateStaticParams() {
  return getBlogIndex().map((p) => {
    const parts = p.href.replace(/^\/blog\//, "").split("/");
    const [year, month, day, encodedSlug] = parts;
    // App Router expects raw param values here and will URL-encode them.
    // Passing an already encoded slug can produce mismatched static paths.
    return { year, month, day, slug: decodeURIComponent(encodedSlug) };
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { year, month, day, slug } = await params;
  const filePath = getBlogPostFilePath(year, month, day, slug);
  if (!filePath) notFound();

  const { title, body } = readBlogPostMarkdown(filePath);
  const livelyPlain = markdownBodyToLivelyPlain(body);

  return (
    <PageShell>
      <nav className="mb-8" aria-label="breadcrumb">
        <BlogBackLink />
      </nav>
      <article className="max-w-3xl">
        <BlogPostArticle
          title={title}
          body={body}
          livelyPlain={livelyPlain}
        />
      </article>
    </PageShell>
  );
}
