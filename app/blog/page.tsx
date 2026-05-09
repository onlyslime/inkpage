import type { Metadata } from "next";
import { BlogPageClient } from "./BlogPageClient";
import { getBlogIndex } from "@/lib/blogIndex";

export const metadata: Metadata = {
  title: "博客",
  description: "文章归档",
};

export default function BlogPage() {
  const posts = getBlogIndex();
  const livelyPlain =
    `博客\n\n` + posts.map((p) => `${p.date} ${p.title}`).join("\n");

  return <BlogPageClient posts={posts} livelyPlain={livelyPlain} />;
}
