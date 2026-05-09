"use client";

import {
  introCopy,
  INTRO_CV_PATH,
} from "@/lib/siteCopy";
import { useSite } from "../components/SiteProvider";

export function IntroCvLink() {
  const { locale } = useSite();
  const t = introCopy[locale];

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          href={INTRO_CV_PATH}
          download="cv-placeholder.pdf"
          className="inline-flex text-lg font-medium text-link underline decoration-link/40 underline-offset-[5px] transition-colors hover:text-link-hover hover:decoration-link-hover/40"
        >
          {t.cvLinkLabel}
        </a>
      </div>
      <div className="space-y-1 text-base leading-7 text-muted-foreground">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {t.profileHeading}
        </h3>
        <p>{t.profileSummerCampRank}</p>
        <p>{t.profileExpectedRecommendationRank}</p>
        <p>
          {t.profileEnglishLevelPrefix}
          {t.profileCET6Label}
        </p>
        <p>{t.profileAlgorithmLevel}</p>
      </div>
    </div>
  );
}
