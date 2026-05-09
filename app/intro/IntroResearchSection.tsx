"use client";

import { TextEscapeBlock } from "../components/TextEscapeBlock";
import {
  getIntroResearchLivelyPlain,
  INTRO_RESEARCH_SOFTWARE,
  introCopy,
} from "@/lib/siteCopy";
import { useSite } from "../components/SiteProvider";

const h2Class =
  "text-2xl font-semibold tracking-tight text-foreground";
const h3Class =
  "text-lg font-semibold tracking-tight text-foreground";

export function IntroResearchSection() {
  const { locale, livelyMode, reducedMotion } = useSite();
  const t = introCopy[locale];
  const showLively = livelyMode && !reducedMotion;
  const plain = getIntroResearchLivelyPlain(locale);
  const rows = INTRO_RESEARCH_SOFTWARE[locale];

  return (
    <section
      className="mt-16 border-t border-section-divider pt-12"
      aria-labelledby="intro-copyright-heading"
    >
      <h2 id="intro-copyright-heading" className={h2Class}>
        {t.researchHeading}
      </h2>

      <TextEscapeBlock
        key={showLively ? "research-pretext" : "research-static"}
        text={plain}
        escapeMode={showLively}
        reducedMotion={reducedMotion}
      >
        <div className="mt-8">
          <h3 className={h3Class}>{t.researchCopyrightHeading}</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[min(100%,42rem)] border-collapse text-left text-base leading-7 text-foreground sm:text-lg sm:leading-8">
              <thead>
                <tr className="border-b border-border/80">
                  <th className="py-2 pr-4 font-medium text-table-head">
                    {t.researchColTime}
                  </th>
                  <th className="py-2 pr-4 font-medium text-table-head">
                    {t.researchColAbbr}
                  </th>
                  <th className="py-2 font-medium text-table-head">
                    {t.researchColName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.date}-${row.abbr}`}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-3 pr-4 align-top font-mono text-sm text-muted-foreground sm:text-base">
                      {row.date}
                    </td>
                    <td className="py-3 pr-4 align-top">{row.abbr}</td>
                    <td className="py-3 align-top">{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TextEscapeBlock>
    </section>
  );
}
