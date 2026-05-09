"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LivelyPage } from "../components/LivelyPage";
import { PageShell } from "../components/PageShell";
import { useSite } from "../components/SiteProvider";
import type { BlogIndexItem } from "@/lib/blogIndex";
import { blogCopy } from "@/lib/siteCopy";

type Props = {
  posts: BlogIndexItem[];
  livelyPlain: string;
};

function groupByYear(posts: BlogIndexItem[]): Map<number, BlogIndexItem[]> {
  const m = new Map<number, BlogIndexItem[]>();
  for (const p of posts) {
    const list = m.get(p.year) ?? [];
    list.push(p);
    m.set(p.year, list);
  }
  for (const list of m.values()) {
    list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }
  return m;
}

export function BlogPageClient({ posts, livelyPlain }: Props) {
  const { locale } = useSite();
  const t = blogCopy[locale];

  const years = useMemo(() => {
    const m = groupByYear(posts);
    return [...m.keys()].sort((a, b) => b - a);
  }, [posts]);

  const byYear = useMemo(() => groupByYear(posts), [posts]);

  const [open, setOpen] = useState<Record<number, boolean>>(() => {
    const o: Record<number, boolean> = {};
    for (const y of years) o[y] = true;
    return o;
  });

  const toggleYear = (y: number) => {
    setOpen((prev) => ({ ...prev, [y]: !prev[y] }));
  };

  return (
    <PageShell>
      <LivelyPage livelyPlainText={livelyPlain}>
        <article>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t.title}
          </h1>

          {posts.length === 0 ? (
            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-muted-foreground">
              {t.body}
            </p>
          ) : (
            <div className="mt-10 space-y-10">
              {years.map((year) => {
                const yearPosts = byYear.get(year) ?? [];
                const isOpen = open[year] !== false;
                return (
                  <section key={year} className="scroll-mt-20">
                    <button
                      type="button"
                      onClick={() => toggleYear(year)}
                      className="flex w-full items-center gap-2 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        className="text-2xl font-bold tracking-tight text-[#a63d2d] dark:text-[#d97757]"
                        style={{ fontFamily: "var(--font-noto-sans-sc), sans-serif" }}
                      >
                        {year}
                        {locale === "zh" ? " 年" : ""}
                      </span>
                      <span
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200"
                        style={{
                          transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                        }}
                        aria-hidden
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M3 4.5L6 8L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {isOpen ? (
                      <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-foreground/70">
                        {yearPosts.map((p) => (
                          <li
                            key={p.href}
                            className="pl-1 text-base leading-8 text-muted-foreground"
                          >
                            <span className="tabular-nums">{p.date}</span>
                            <span className="mx-2 text-foreground/50">»</span>
                            <Link
                              href={p.href}
                              className="font-normal text-sky-600 underline-offset-4 transition hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                            >
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>
          )}
        </article>
      </LivelyPage>
    </PageShell>
  );
}
