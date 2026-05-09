"use client";

import { type ReactNode, useEffect, useState } from "react";
import {
  INTRO_ACCESS_STORAGE_KEY,
  DOWNLOAD_AUTH_COOKIE,
} from "@/lib/accessControl";
import { useSite } from "./SiteProvider";

type Props = {
  children: ReactNode;
};

async function verifyPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}

async function verifyAccessKey(key: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/auth/verify?key=${encodeURIComponent(key)}`);
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}

function setAccessGranted() {
  try {
    localStorage.setItem(INTRO_ACCESS_STORAGE_KEY, "1");
  } catch {
    // ignore
  }
  try {
    document.cookie = `${DOWNLOAD_AUTH_COOKIE}=1; path=/; max-age=2592000`;
  } catch {
    // ignore
  }
}

export function PasswordGuard({ children }: Props) {
  const { locale } = useSite();
  const [mounted, setMounted] = useState(false);
  const [granted, setGranted] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1) 检查 localStorage
    try {
      const stored = localStorage.getItem(INTRO_ACCESS_STORAGE_KEY);
      if (stored === "1") {
        setGranted(true);
        return;
      }
    } catch {
      // localStorage 不可用则继续检查 URL
    }

    // 2) 检查 URL access key，发送到服务端验证
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    if (key) {
      verifyAccessKey(key).then((ok) => {
        if (ok) {
          setGranted(true);
          setAccessGranted();
          // 移除 URL 中的 key，避免分享时泄漏
          const url = new URL(window.location.href);
          url.searchParams.delete("key");
          window.history.replaceState({}, "", url.toString());
        }
      });
    }
  }, []);

  const submit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const ok = await verifyPassword(trimmed);
    if (ok) {
      setGranted(true);
      setError(false);
      setAccessGranted();
    } else {
      setError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  // SSR 阶段不渲染任何内容，避免水合不匹配
  if (!mounted) return null;

  if (granted) return <>{children}</>;

  const t =
    locale === "zh"
      ? {
          title: "此页面需要密码",
          placeholder: "请输入密码",
          button: "进入",
          error: "密码错误，请重试",
        }
      : {
          title: "This page is password protected",
          placeholder: "Enter password",
          button: "Enter",
          error: "Incorrect password, please try again",
        };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-5">
        <h1 className="text-center text-xl font-semibold tracking-tight text-foreground">
          {t.title}
        </h1>

        <div className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            autoFocus
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-card-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {t.error}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            className="w-full rounded-xl bg-accent px-4 py-3 text-base font-medium text-accent-foreground transition hover:opacity-90"
          >
            {t.button}
          </button>
        </div>
      </div>
    </div>
  );
}
