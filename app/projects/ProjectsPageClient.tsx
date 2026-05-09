"use client";

import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { useSite } from "../components/SiteProvider";
import { projectsCopy } from "@/lib/siteCopy";

const headingClass =
  "text-2xl font-semibold tracking-tight text-foreground";

const bubbleClass =
  "inline-flex max-w-full items-center justify-center rounded-full border border-border bg-gradient-to-br from-card to-muted px-5 py-3 text-center text-sm font-medium text-foreground shadow-sm ring-1 ring-border/60 transition hover:scale-[1.03] hover:border-muted-foreground/30 hover:shadow-md sm:px-6 sm:text-base";

type Props = {
  items: { slug: string; name: string }[];
};

export function ProjectsPageClient({ items }: Props) {
  const { locale } = useSite();
  const t = projectsCopy[locale];

  return (
    <PageShell>
      <h1 className={headingClass}>{t.title}</h1>

      <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:gap-5">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            data-lively-exclude
            className={bubbleClass}
          >
            {p.name}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
