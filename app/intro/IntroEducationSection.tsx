"use client";

import { TextEscapeBlock } from "../components/TextEscapeBlock";
import {
  getIntroEducationLivelyPlain,
  INTRO_EDUCATION,
  introCopy,
} from "@/lib/siteCopy";
import { useSite } from "../components/SiteProvider";

const headingClass =
  "text-2xl font-semibold tracking-tight text-foreground";

function EducationTable({ locale }: { locale: "zh" | "en" }) {
  const t = introCopy[locale];
  const rows = INTRO_EDUCATION[locale];

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[min(100%,36rem)] border-collapse text-left text-base leading-7 text-foreground sm:text-lg sm:leading-8">
        <thead>
          <tr className="border-b border-border/80">
            <th className="py-2 pr-4 font-medium text-table-head">
              {t.educationColTime}
            </th>
            <th className="py-2 pr-4 font-medium text-table-head">
              {t.educationColDegree}
            </th>
            <th className="py-2 font-medium text-table-head">
              {t.educationColSchool}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.time}-${row.school}`}
              className="border-b border-border/50 last:border-0"
            >
              <td className="py-3 pr-4 align-top font-mono text-sm text-muted-foreground sm:text-base">
                {row.time}
              </td>
              <td className="py-3 pr-4 align-top">{row.degree}</td>
              <td className="py-3 align-top">{row.school}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IntroEducationSection() {
  const { locale, livelyMode, reducedMotion } = useSite();
  const t = introCopy[locale];
  const showLively = livelyMode && !reducedMotion;
  const educationPlain = getIntroEducationLivelyPlain(locale);

  return (
    <section
      className="mt-16 border-t border-section-divider pt-12"
      aria-labelledby="intro-education-heading"
    >
      <h2 id="intro-education-heading" className={headingClass}>
        {t.educationHeading}
      </h2>

      <TextEscapeBlock
        key={showLively ? "education-pretext" : "education-static"}
        text={educationPlain}
        escapeMode={showLively}
        reducedMotion={reducedMotion}
      >
        <EducationTable locale={locale} />
      </TextEscapeBlock>
    </section>
  );
}
