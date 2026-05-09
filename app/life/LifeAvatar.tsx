"use client";

import { useState } from "react";

import { lifeCopy } from "@/lib/siteCopy";
import { useSite } from "../components/SiteProvider";

const sizes = {
  sm: { className: "h-10 w-10", text: "text-xs", px: 40 },
  md: { className: "h-12 w-12", text: "text-sm", px: 48 },
  /** Profile page large avatar */
  profile: { className: "h-28 w-28", text: "text-3xl", px: 112 },
} as const;

type Props = {
  src: string;
  size?: keyof typeof sizes;
};

export function LifeAvatar({ src, size = "md" }: Props) {
  const { locale } = useSite();
  const t = lifeCopy[locale];
  const [ok, setOk] = useState(true);
  const s = sizes[size];

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border ${s.className}`}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={t.avatarAlt}
          className="h-full w-full object-cover"
          width={s.px}
          height={s.px}
          onError={() => setOk(false)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center font-medium text-foreground ${s.text}`}
        >
          {locale === "zh" ? "你" : "Y"}
        </div>
      )}
    </div>
  );
}
