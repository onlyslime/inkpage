"use client";

import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { PasswordGuard } from "../../components/PasswordGuard";
import { useSite } from "../../components/SiteProvider";
import {
  livelyPlainFromDetail,
  type ProjectSection,
} from "@/lib/projectDetailCopy";
import type { ProjectDetailBilingual } from "@/lib/projectDetailLoad";
import { projectsCopy } from "@/lib/siteCopy";
import { PROTECTED_PROJECT_SLUGS } from "@/lib/accessControl";

const headingClass =
  "text-2xl font-semibold tracking-tight text-foreground";

const sectionHeadingClass =
  "text-xl font-semibold tracking-tight text-foreground";

type Props = {
  slug: string;
  bilingual: ProjectDetailBilingual | null;
  displayName: string;
};

function SectionBodies({ body }: { body: string }) {
  const paragraphs = body.split(/\n\n/).filter(Boolean);
  return (
    <div className="mt-3 space-y-4">
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="text-base leading-8 text-muted-foreground"
        >
          {para}
        </p>
      ))}
    </div>
  );
}

const projectTableClass =
  "w-full border-collapse text-sm text-muted-foreground [&_th]:border [&_th]:border-border [&_th]:bg-muted/40 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2";

function SectionContent({ section }: { section: ProjectSection }) {
  return (
    <>
      {section.blocks.map((block, i) => {
        if (block.kind === "text") {
          return <SectionBodies key={i} body={block.text} />;
        }
        if (block.kind === "table") {
          return (
            <div
              key={i}
              className="mt-4 max-w-full overflow-x-auto"
              data-lively-exclude
            >
              {block.caption ? (
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {block.caption}
                </p>
              ) : null}
              <table className={projectTableClass}>
                <thead>
                  <tr>
                    {block.headers.map((h, hi) => (
                      <th key={hi}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <div key={i} className="mt-4">
            {block.caption ? (
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                {block.caption}
              </p>
            ) : null}
            <pre
              className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-foreground"
              data-lively-exclude
            >
              <code className="font-mono">{block.code}</code>
            </pre>
          </div>
        );
      })}
      {section.links?.length ? (
        <ul className="mt-4 list-none space-y-2">
          {section.links.map((l) => (
            <li key={`${l.href}-${l.label}`}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                data-lively-exclude
                className="text-base font-medium text-link underline-offset-4 transition hover:text-link-hover"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

const VIDEO_PROJECTS = [
  "example-project-1",
];

function ProjectContent({ slug, bilingual, displayName }: Props) {
  const { locale } = useSite();
  const t = projectsCopy[locale];

  const detail = bilingual?.[locale] ?? null;
  const livelyPlain = detail ? livelyPlainFromDetail(detail) : null;

  if (detail && livelyPlain) {
    return (
      <PageShell>
        <nav className="mb-8" aria-label="breadcrumb">
          <Link
            href="/projects"
            data-lively-exclude
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            {t.backToProjects}
          </Link>
        </nav>

        <article>
          <h1 className={headingClass}>{displayName}</h1>

            <div className="mt-6 max-w-3xl">
              {VIDEO_PROJECTS.includes(slug) ? (
                <section className="mt-2 scroll-mt-20" data-lively-exclude>
                  <div className="overflow-hidden rounded-xl border border-border bg-black/90">
                    <video
                      className="h-auto w-full"
                      controls
                      preload="metadata"
                      playsInline
                      src={`/api/projects/asset/${slug}/intro.mp4`}
                    />
                  </div>
                </section>
              ) : null}
              {detail.sections.map((section) => (
                <section
                  key={section.heading}
                  className={`mt-10 scroll-mt-20 ${
                    VIDEO_PROJECTS.includes(slug)
                      ? ""
                      : "first:mt-0"
                  }`}
                >
                  <h2 className={sectionHeadingClass}>{section.heading}</h2>
                  <SectionContent section={section} />
                </section>
              ))}
              {detail.footnotes?.length ? (
                <section
                  className="mt-14 scroll-mt-20 border-t border-border pt-10"
                  aria-labelledby="project-detail-footnotes"
                >
                  <h2
                    id="project-detail-footnotes"
                    className={sectionHeadingClass}
                  >
                    {t.detailFootnotesHeading}
                  </h2>
                  <ol className="mt-4 list-none space-y-4 text-base leading-7 text-muted-foreground">
                    {[...detail.footnotes]
                      .sort((a, b) => a.n - b.n)
                      .map((fn) => (
                        <li key={fn.n} className="flex gap-2">
                          <span
                            className="shrink-0 font-medium tabular-nums text-foreground"
                            aria-hidden
                          >
                            <sup>{fn.n}</sup>
                          </span>
                          <span>{fn.body}</span>
                        </li>
                      ))}
                  </ol>
                </section>
              ) : null}
            </div>
        </article>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <nav className="mb-8" aria-label="breadcrumb">
        <Link
          href="/projects"
          data-lively-exclude
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          {t.backToProjects}
        </Link>
      </nav>

      <article>
        <h1 className={headingClass}>{displayName}</h1>

          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-muted-foreground">
            {t.detailTodo}
          </p>
      </article>
    </PageShell>
  );
}

export function ProjectDetailClient(props: Props) {
  const { slug } = props;

  if ((PROTECTED_PROJECT_SLUGS as readonly string[]).includes(slug)) {
    return (
      <PasswordGuard>
        <ProjectContent {...props} />
      </PasswordGuard>
    );
  }

  return <ProjectContent {...props} />;
}
