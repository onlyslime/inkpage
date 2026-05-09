"use client";

import { PageShell } from "../components/PageShell";
import { useFont } from "../components/FontProvider";
import { useSite } from "../components/SiteProvider";
import { useTheme } from "../components/ThemeProvider";
import { settingsCopy } from "@/lib/siteCopy";
import { FONT_IDS, type FontId } from "@/lib/fontChoice";
import { THEME_IDS, type ThemeId } from "@/lib/uiThemes";

const headingClass =
  "text-2xl font-semibold tracking-tight text-foreground";

export function SettingsPageClient() {
  const { locale } = useSite();
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFont();
  const t = settingsCopy[locale];

  return (
    <PageShell>
      <h1 className={headingClass}>{t.title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        {t.subtitle}
      </p>

      <p className="mt-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{t.currentLabel}:</span>{" "}
        <span className="text-foreground">
          {t.themeNames[theme as keyof typeof t.themeNames]}
        </span>
      </p>

      <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2">
        {THEME_IDS.map((id: ThemeId) => {
          const active = theme === id;
          const name = t.themeNames[id as keyof typeof t.themeNames];
          const blurb = t.themeBlurbs[id as keyof typeof t.themeBlurbs];
          return (
            <li key={id}>
              <button
                type="button"
                data-lively-exclude
                onClick={() => setTheme(id)}
                className={`flex w-full flex-col rounded-2xl border px-5 py-4 text-left transition ${
                  active
                    ? "border-accent bg-muted ring-2 ring-ring"
                    : "border-border bg-card text-card-foreground hover:border-muted-foreground/40"
                }`}
              >
                <span className="font-semibold text-foreground">{name}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {blurb}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <h2 className={`${headingClass} mt-16`}>{t.fontHeading}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        {t.fontSubtitle}
      </p>

      <p className="mt-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {t.currentFontLabel}:
        </span>{" "}
        <span className="text-foreground">
          {t.fontNames[font as keyof typeof t.fontNames]}
        </span>
      </p>

      <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2">
        {FONT_IDS.map((id: FontId) => {
          const active = font === id;
          const name = t.fontNames[id as keyof typeof t.fontNames];
          const blurb = t.fontBlurbs[id as keyof typeof t.fontBlurbs];
          return (
            <li key={id}>
              <button
                type="button"
                data-lively-exclude
                onClick={() => setFont(id)}
                className={`flex w-full flex-col rounded-2xl border px-5 py-4 text-left transition ${
                  active
                    ? "border-accent bg-muted ring-2 ring-ring"
                    : "border-border bg-card text-card-foreground hover:border-muted-foreground/40"
                }`}
              >
                <span className="font-semibold text-foreground">{name}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {blurb}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
