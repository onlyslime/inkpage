"use client";

import { useState } from "react";
import Link from "next/link";
import { useSite } from "./components/SiteProvider";
import { TypewriterText } from "./components/TypewriterText";

const copy = {
  zh: {
    name: "墨站",
    tagline: "一个个人网页框架",
    nav: [
      { href: "/intro", label: "介绍" },
      { href: "/projects", label: "项目" },
      { href: "/blog", label: "博客" },
      { href: "/life", label: "生活" },
      { href: "/friends", label: "友链" },
    ],
  },
  en: {
    name: "Inkpage",
    tagline: "A personal website framework",
    nav: [
      { href: "/intro", label: "About" },
      { href: "/projects", label: "Projects" },
      { href: "/blog", label: "Blog" },
      { href: "/life", label: "Life" },
      { href: "/friends", label: "Friends" },
    ],
  },
};

export function HomePageClient() {
  const { locale } = useSite();
  const t = copy[locale];
  const [line1Done, setLine1Done] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center px-6 pb-28 pt-20 text-center sm:pt-32">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground shadow-sm ring-1 ring-border sm:h-24 sm:w-24">
        {locale === "zh" ? "我" : "Me"}
      </div>
      <h1 className="mt-6 text-6xl font-semibold tracking-tight text-foreground sm:text-7xl">
        <TypewriterText
          text={t.name}
          speed={180}
          onDone={() => setLine1Done(true)}
        />
      </h1>

      <p className="mt-6 h-8 text-xl leading-relaxed text-muted-foreground sm:h-9 sm:text-2xl">
        {line1Done && (
          <TypewriterText text={t.tagline} speed={90} />
        )}
      </p>

      <nav
        className={`mt-14 flex flex-wrap justify-center gap-3 transition-opacity duration-700 sm:gap-4 ${
          line1Done ? "opacity-100" : "opacity-0"
        }`}
      >
        {t.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-base font-medium text-card-foreground shadow-sm ring-1 ring-border/60 transition hover:scale-[1.04] hover:border-muted-foreground/30 hover:shadow-md sm:px-6 sm:py-3"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
