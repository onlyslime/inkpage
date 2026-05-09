"use client";

import {
  introBioSegments,
  INSTITUTION_OFFICIAL_URL,
} from "@/lib/siteCopy";
import { useSite } from "../components/SiteProvider";

const linkClass =
  "text-link underline decoration-link/40 underline-offset-[5px] transition-colors hover:text-link-hover hover:decoration-link-hover/40";

type IntroBioParagraphProps = {
  className?: string;
};

export function IntroBioParagraph({
  className = "mt-10 text-lg leading-8 text-muted-foreground",
}: IntroBioParagraphProps) {
  const { locale } = useSite();
  const s = introBioSegments[locale];

  return (
    <p className={className}>
      {s.before}
      <a
        href={INSTITUTION_OFFICIAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {s.linkLabel}
      </a>
      {s.after}
    </p>
  );
}
