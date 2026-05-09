"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "./SiteProvider";

export function SiteHeader() {
  const { locale, toggleLocale } = useSite();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(
      document.cookie.includes("site_auth=1") ||
        localStorage.getItem("intro_access_granted") === "1"
    );
  }, []);

  const isProtectedPage =
    pathname === "/intro" || pathname.startsWith("/projects");
  const showRealName = isProtectedPage && authed;
  const name = showRealName
    ? locale === "zh"
      ? "你的名字"
      : "Your Name"
    : locale === "zh"
      ? "你的名字"
      : "Your Name";
  const nav =
    locale === "zh"
      ? [
          { href: "/", label: "主页" },
          { href: "/intro", label: "介绍" },
          { href: "/projects", label: "项目" },
          { href: "/blog", label: "博客" },
          { href: "/life", label: "生活" },
          { href: "/friends", label: "友链" },
          { href: "/settings", label: "设置" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/intro", label: "About" },
          { href: "/projects", label: "Projects" },
          { href: "/blog", label: "Blog" },
          { href: "/life", label: "Life" },
          { href: "/friends", label: "Friends" },
          { href: "/settings", label: "Settings" },
        ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      data-lively-exclude
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-card/90 backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* 桌面端主导航 */}
        <nav
          className="hidden min-w-0 flex-1 items-center gap-2 text-sm font-medium text-foreground sm:flex sm:gap-3 sm:text-base"
          aria-label={locale === "zh" ? "主导航" : "Main"}
        >
          <Link
            href="/"
            className="shrink-0 font-semibold tracking-tight text-foreground transition-colors hover:text-muted-foreground"
          >
            {name}
          </Link>
          <span className="shrink-0 text-border" aria-hidden>
            |
          </span>
          <ul className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
            {nav.map((item) => {
              const active =
                item.href === "/projects"
                  ? pathname === "/projects" ||
                    pathname.startsWith("/projects/")
                  : item.href === "/friends"
                    ? pathname === "/friends"
                    : item.href === "/settings"
                      ? pathname === "/settings"
                      : pathname === item.href;
              return (
                <Fragment key={item.href}>
                  {item.href === "/settings" && (
                    <li className="shrink-0 text-border" aria-hidden>
                      |
                    </li>
                  )}
                  <li>
                    <Link
                      href={item.href}
                      className={
                        active
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground transition-colors hover:text-foreground"
                      }
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </nav>

        {/* 移动端：名字 + 汉堡菜单 */}
        <div className="flex flex-1 items-center gap-3 sm:hidden">
          <Link
            href="/"
            className="font-semibold tracking-tight text-foreground"
          >
            {name}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-card-foreground shadow-sm sm:hidden"
          aria-label={locale === "zh" ? "打开菜单" : "Open menu"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        {/* 桌面端语言切换 */}
        <button
          type="button"
          onClick={toggleLocale}
          className="hidden shrink-0 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-card-foreground shadow-sm transition-colors hover:bg-muted sm:block sm:px-3 sm:text-sm"
          title={
            locale === "zh"
              ? "当前：中文 · 点击切换为 English"
              : "Current: English · Click for 中文"
          }
        >
          {locale === "zh" ? "中文" : "English"}
        </button>
      </div>

      {/* 移动端抽屉菜单 */}
      {mobileOpen && (
        <div className="sm:hidden">
          {/* 遮罩 */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden
          />
          {/* 抽屉 */}
          <div className="fixed top-0 left-0 z-50 h-screen w-[80vw] max-w-xs overflow-y-auto bg-card shadow-2xl">
            {/* 头部 */}
            <div className="sticky top-0 flex h-14 items-center justify-between border-b border-border bg-card px-4">
              <span className="font-semibold text-foreground">
                {locale === "zh" ? "菜单" : "Menu"}
              </span>
              <button
                type="button"
                onClick={closeMobile}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={locale === "zh" ? "关闭菜单" : "Close menu"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* 导航项 */}
            <nav className="px-4 py-6" aria-label={locale === "zh" ? "移动端导航" : "Mobile navigation"}>
              <ul className="space-y-2">
                {nav.map((item) => {
                  const active =
                    item.href === "/projects"
                      ? pathname === "/projects" ||
                        pathname.startsWith("/projects/")
                      : item.href === "/friends"
                        ? pathname === "/friends"
                        : item.href === "/settings"
                          ? pathname === "/settings"
                          : pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={`block rounded-xl px-4 py-3.5 text-lg font-medium transition ${
                          active
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 底部语言切换 */}
            <div className="sticky bottom-0 border-t border-border bg-card p-4">
              <button
                type="button"
                onClick={() => {
                  toggleLocale();
                  closeMobile();
                }}
                className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-center text-base font-medium text-card-foreground shadow-sm transition-colors hover:bg-muted"
              >
                {locale === "zh"
                  ? "当前：中文 · 切换为 English"
                  : "Current: English · Switch to 中文"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
