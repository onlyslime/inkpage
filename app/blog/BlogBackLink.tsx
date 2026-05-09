"use client";

import Link from "next/link";
import { useSite } from "../components/SiteProvider";
import { blogCopy } from "@/lib/siteCopy";

export function BlogBackLink() {
  const { locale } = useSite();
  const t = blogCopy[locale];
  return (
    <Link
      href="/blog"
      className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
    >
      {t.title}
    </Link>
  );
}
