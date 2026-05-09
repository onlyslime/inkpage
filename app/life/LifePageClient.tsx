"use client";

import Link from "next/link";

import { scoreFootprint, type FootprintMap } from "@/lib/life/footprint";
import type { MomentDTO } from "@/lib/life/loadMoments";
import { lifeCopy } from "@/lib/siteCopy";
import { PageShell } from "../components/PageShell";
import { useSite } from "../components/SiteProvider";
import { LifeAvatar } from "./LifeAvatar";
import { ChinaFootprintMap } from "./ChinaFootprintMap";
import { LifeMomentsFeed } from "./LifeMomentsFeed";

const h1Class = "text-2xl font-semibold tracking-tight text-foreground";
const h2Class = "mt-12 text-xl font-semibold tracking-tight text-foreground";

type Props = {
  footprint: FootprintMap;
  moments: MomentDTO[];
};

export function LifePageClient({ footprint, moments }: Props) {
  const { locale } = useSite();
  const t = lifeCopy[locale];
  const score = scoreFootprint(footprint);
  const avatarSrc = "/api/life/file/avatar.jpg";

  return (
    <PageShell>
      <div className="space-y-0">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <h1 className={h1Class}>{t.momentsPageTitle}</h1>
          <Link
            href="/life/post"
            aria-label={t.postLinkAria}
            title={t.postLinkAria}
            className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-lg font-light leading-none text-foreground shadow-sm transition hover:bg-muted"
          >
            +
          </Link>
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <div className="shrink-0 rounded-full bg-gradient-to-br from-accent/25 via-accent/5 to-transparent p-1 shadow-lg ring-2 ring-border ring-offset-2 ring-offset-background">
            <LifeAvatar src={avatarSrc} size="profile" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md border border-border bg-muted/80 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-foreground">
                {t.profileMeBadge}
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {t.displayName}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">{t.profileAvatarHint}</p>
          </div>
        </div>

        <section className="mt-10 space-y-4" aria-labelledby="life-footprint-heading">
          <h2 id="life-footprint-heading" className={h2Class}>
            {t.footprintHeading}
          </h2>
          <div data-lively-exclude className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                {t.scoreLabel}：<strong className="text-foreground">{score}</strong>
              </span>
              <span className="inline-flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-[#dc2626]" />
                  {t.legendLong}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-[#ca8a04]" />
                  {t.legendTour}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-[#2563eb]" />
                  {t.legendPass}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-[#16a34a]" />
                  {t.legendPlan}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-muted ring-1 ring-border" />
                  {t.legendNone}
                </span>
              </span>
            </div>
            <ChinaFootprintMap footprint={footprint} />
          </div>
        </section>

        <section className="mt-12 space-y-4" aria-labelledby="life-feed-heading">
          <h2 id="life-feed-heading" className={h2Class}>
            {t.feedHeading}
          </h2>
          <LifeMomentsFeed moments={moments} avatarSrc={avatarSrc} />
        </section>
      </div>
    </PageShell>
  );
}
