"use client";

import { PageShell } from "../components/PageShell";
import { useSite } from "../components/SiteProvider";
import { introCopy } from "@/lib/siteCopy";
import { IntroBioParagraph } from "./IntroBioParagraph";
import { IntroContactSection } from "./IntroContactSection";
import { IntroEducationSection } from "./IntroEducationSection";
import { IntroAwardsSection } from "./IntroAwardsSection";
import { IntroResearchSection } from "./IntroResearchSection";
import { IntroCvLink } from "./IntroCvLink";
import { PasswordGuard } from "../components/PasswordGuard";

const aboutHeadingClass =
  "text-2xl font-semibold tracking-tight text-foreground";

export function IntroPageClient() {
  const { locale } = useSite();
  const copy = introCopy[locale];

  return (
    <PasswordGuard>
      <PageShell>
        <article>
          <h1 className="sr-only">{copy.title}</h1>

          <section className="space-y-0" aria-labelledby="intro-about-heading">
            <h2 id="intro-about-heading" className={aboutHeadingClass}>
              {copy.sectionHeading}
            </h2>

            <div className="mt-8 flex justify-center">
              <div className="flex h-64 w-64 items-center justify-center rounded-xl bg-muted text-4xl font-semibold text-muted-foreground shadow-sm ring-1 ring-border">
                {locale === "zh" ? "头像" : "Photo"}
              </div>
            </div>
            <IntroBioParagraph />
            <IntroCvLink />
          </section>

          <IntroContactSection />
          <IntroEducationSection />
          <IntroAwardsSection />
          <IntroResearchSection />
        </article>
      </PageShell>
    </PasswordGuard>
  );
}
