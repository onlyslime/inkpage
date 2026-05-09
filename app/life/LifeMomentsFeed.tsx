"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { formatMomentDate } from "@/lib/life/formatMomentDate";
import type { MomentDTO } from "@/lib/life/loadMoments";
import { lifeCopy } from "@/lib/siteCopy";
import { TextEscapeBlock } from "../components/TextEscapeBlock";
import { useSite } from "../components/SiteProvider";

import { ImageLightbox } from "./ImageLightbox";
import { LifeAvatar } from "./LifeAvatar";

type Props = {
  moments: MomentDTO[];
  avatarSrc: string;
};

const momentStageClass =
  "relative w-full text-[15px] leading-relaxed text-pretext";

/** 拼 `/api/life/file/...`，支持 `images` 中带子目录如 `jpgs/a.jpg` */
function momentImageSrc(relDir: string, file: string): string {
  const parts = [
    ...relDir.split("/").filter(Boolean),
    ...file.split("/").filter(Boolean),
  ];
  return `/api/life/file/${parts.map((p) => encodeURIComponent(p)).join("/")}`;
}

export function LifeMomentsFeed({ moments, avatarSrc }: Props) {
  const { locale, livelyMode, reducedMotion } = useSite();
  const t = lifeCopy[locale];
  const now = useMemo(() => new Date(), []);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  if (moments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t.feedEmpty}</p>
    );
  }

  return (
    <>
      <ImageLightbox
        src={previewSrc}
        open={previewSrc !== null}
        onClose={() => setPreviewSrc(null)}
        dialogLabel={t.imagePreviewDialog}
        closeLabel={t.imagePreviewClose}
      />
      <ul className="space-y-6">
      {moments.map((m) => {
        const created = new Date(m.createdAt);
        const label = formatMomentDate(created, now, locale);
        return (
          <li
            key={`${m.relDir}-${m.createdAt}`}
            className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm"
          >
            <div className="flex gap-3">
              <LifeAvatar src={avatarSrc} size="sm" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-foreground">
                    {t.displayName}
                  </span>
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={m.createdAt}
                  >
                    {label}
                  </time>
                </div>
                {m.text ? (
                  <TextEscapeBlock
                    text={m.text}
                    escapeMode={livelyMode}
                    reducedMotion={reducedMotion}
                    clipObstacleToStage
                    className={momentStageClass}
                  >
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                      {m.text}
                    </p>
                  </TextEscapeBlock>
                ) : null}
                {m.images.length > 0 ? (
                  <div
                    data-lively-exclude
                    className={`grid gap-2 ${
                      m.images.length === 1
                        ? "grid-cols-1"
                        : m.images.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-3"
                    } max-w-lg`}
                  >
                    {m.images.slice(0, 9).map((img) => {
                      const src = momentImageSrc(m.relDir, img);
                      return (
                        <button
                          key={img}
                          type="button"
                          className="group relative aspect-square overflow-hidden rounded-lg bg-muted text-left outline-none ring-offset-2 ring-offset-card transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={() => setPreviewSrc(src)}
                          aria-label={t.imagePreviewOpen}
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 34vw, 180px"
                            className="object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
      </ul>
    </>
  );
}
