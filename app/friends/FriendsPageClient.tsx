"use client";

import { PageShell } from "../components/PageShell";
import { useSite } from "../components/SiteProvider";

type FriendEntry = {
  slug: string;
  name: string;
  url: string;
  avatarPath: string;
};

type Props = { items: FriendEntry[] };

const copy = {
  zh: {
    title: "友链",
    empty: "还没有友链，稍后再来看看。",
    open: "访问",
  },
  en: {
    title: "Friends",
    empty: "No links yet.",
    open: "Visit",
  },
} as const;

export function FriendsPageClient({ items }: Props) {
  const { locale } = useSite();
  const t = copy[locale];

  return (
    <PageShell>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {t.title}
      </h1>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{t.empty}</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.slug}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                data-lively-exclude
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-muted-foreground/30 hover:bg-muted/30"
              >
                <img
                  src={item.avatarPath}
                  alt={item.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 rounded-full border border-border object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">
                    {item.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {item.url}
                  </div>
                </div>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground group-hover:text-foreground">
                  {t.open}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
