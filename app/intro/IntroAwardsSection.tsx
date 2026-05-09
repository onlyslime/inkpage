"use client";

import { TextEscapeBlock } from "../components/TextEscapeBlock";
import {
  getIntroAwardsLivelyPlain,
  INTRO_AWARDS_COMPETITION,
  INTRO_AWARDS_HONOR,
  introCopy,
} from "@/lib/siteCopy";
import { useSite } from "../components/SiteProvider";

const h2Class =
  "text-2xl font-semibold tracking-tight text-foreground";
const h3Class =
  "text-lg font-semibold tracking-tight text-foreground";

/** 与教育经历表格一致的表头弱化样式 */
function AwardSubTable({
  items,
  locale,
}: {
  items: readonly {
    date: string;
    title: string;
    proofPath?: string;
    proofFilename?: string;
  }[];
  locale: "zh" | "en";
}) {
  const t = introCopy[locale];

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[min(100%,36rem)] border-collapse text-left text-base leading-7 text-foreground sm:text-lg sm:leading-8">
        <thead>
          <tr className="border-b border-border/80">
            <th className="py-2 pr-4 font-medium text-table-head">
              {t.awardsColTime}
            </th>
            <th className="py-2 font-medium text-table-head">
              {t.awardsColAward}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr
              key={`${row.date}-${row.title}`}
              className="border-b border-border/50 last:border-0"
            >
              <td className="py-3 pr-4 align-top font-mono text-sm text-muted-foreground sm:text-base">
                {row.date}
              </td>
              <td className="py-3 align-top">
                {row.title}
                {row.proofPath ? (
                  <a
                    href={row.proofPath}
                    download={row.proofFilename}
                    className="ml-2 text-link underline decoration-link/40 underline-offset-[4px] transition-colors hover:text-link-hover hover:decoration-link-hover/40"
                  >
                    {t.awardsProofLabel}
                  </a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AwardsContent({ locale }: { locale: "zh" | "en" }) {
  const t = introCopy[locale];
  const honor = INTRO_AWARDS_HONOR[locale];
  const competition = INTRO_AWARDS_COMPETITION[locale];

  return (
    <div className="mt-8 space-y-10">
      <div>
        <h3 className={h3Class}>{t.awardsHonorHeading}</h3>
        <AwardSubTable items={honor} locale={locale} />
      </div>
      <div>
        <h3 className={h3Class}>{t.awardsCompetitionHeading}</h3>
        <AwardSubTable items={competition} locale={locale} />
      </div>
    </div>
  );
}

export function IntroAwardsSection() {
  const { locale, livelyMode, reducedMotion } = useSite();
  const t = introCopy[locale];
  const showLively = livelyMode && !reducedMotion;
  const awardsPlain = getIntroAwardsLivelyPlain(locale);

  return (
    <section
      className="mt-16 border-t border-section-divider pt-12"
      aria-labelledby="intro-awards-heading"
    >
      <h2 id="intro-awards-heading" className={h2Class}>
        {t.awardsHeading}
      </h2>

      <TextEscapeBlock
        key={showLively ? "awards-pretext" : "awards-static"}
        text={awardsPlain}
        escapeMode={showLively}
        reducedMotion={reducedMotion}
      >
        <AwardsContent locale={locale} />
      </TextEscapeBlock>
    </section>
  );
}
