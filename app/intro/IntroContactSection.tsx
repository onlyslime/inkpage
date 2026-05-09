"use client";

import { TextEscapeBlock } from "../components/TextEscapeBlock";
import {
  introCopy,
  getIntroContactLivelyPlain,
  INTRO_CONTACT,
} from "@/lib/siteCopy";
import { useSite } from "../components/SiteProvider";

const headingClass =
  "text-2xl font-semibold tracking-tight text-foreground";

function ContactDl({ locale }: { locale: "zh" | "en" }) {
  const t = introCopy[locale];
  const c = INTRO_CONTACT;

  return (
    <dl className="space-y-5 text-lg leading-8 text-foreground">
      <div className="grid gap-1 sm:grid-cols-[minmax(0,7rem)_1fr] sm:gap-6 sm:items-baseline">
        <dt className="font-medium text-muted-foreground">
          {t.contactEmailLabel}
        </dt>
        <dd className="font-mono text-foreground">{c.email}</dd>
      </div>

      <div className="grid gap-1 sm:grid-cols-[minmax(0,7rem)_1fr] sm:gap-6 sm:items-baseline">
        <dt className="font-medium text-muted-foreground">
          {t.contactPhoneLabel}
        </dt>
        <dd className="font-mono text-foreground">{c.phone}</dd>
      </div>


    </dl>
  );
}

export function IntroContactSection() {
  const { locale, livelyMode, reducedMotion } = useSite();
  const t = introCopy[locale];
  const showLively = livelyMode && !reducedMotion;
  const contactPlain = getIntroContactLivelyPlain(locale);

  return (
    <section
      className="mt-16 border-t border-section-divider pt-12"
      aria-labelledby="intro-contact-heading"
    >
      <h2 id="intro-contact-heading" className={headingClass}>
        {t.contactHeading}
      </h2>

      <TextEscapeBlock
        key={showLively ? "contact-pretext" : "contact-static"}
        text={contactPlain}
        escapeMode={showLively}
        reducedMotion={reducedMotion}
      >
        <div className="mt-8">
          <ContactDl locale={locale} />
        </div>
      </TextEscapeBlock>
    </section>
  );
}
