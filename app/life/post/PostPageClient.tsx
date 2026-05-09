"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { lifePostCopy } from "@/lib/siteCopy";
import { PageShell } from "../../components/PageShell";
import { useSite } from "../../components/SiteProvider";

function localDatetimeInputValue(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

type PostJson = {
  ok?: boolean;
  scheduled?: boolean;
  publishAt?: string | null;
  error?: string;
};

export function PostPageClient() {
  const { locale } = useSite();
  const t = lifePostCopy[locale];
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [publishAtLocal, setPublishAtLocal] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { minLocal, maxLocal } = useMemo(() => {
    const now = new Date();
    const max = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return { minLocal: localDatetimeInputValue(now), maxLocal: localDatetimeInputValue(max) };
  }, []);

  const defaultScheduled = useMemo(() => {
    const now = new Date();
    const suggested = new Date(now.getTime() + 60 * 60 * 1000);
    const cap = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const pick = suggested.getTime() > cap.getTime() ? cap : suggested;
    return localDatetimeInputValue(pick);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const fd = new FormData();
    fd.set("text", text);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        fd.append("images", files[i]!);
      }
    }
    if (scheduleLater) {
      const d = new Date(publishAtLocal);
      if (Number.isNaN(d.getTime())) {
        setMsg(t.scheduleHint);
        setLoading(false);
        return;
      }
      fd.set("publishAt", d.toISOString());
    }
    try {
      const res = await fetch("/api/life/moments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
        },
        body: fd,
      });
      const j = (await res.json()) as PostJson;
      if (res.ok && j.ok) {
        setText("");
        setFiles(null);
        setScheduleLater(false);
        setPublishAtLocal(defaultScheduled);
        if (j.scheduled && j.publishAt) {
          const dt = new Date(j.publishAt);
          const timeStr = new Intl.DateTimeFormat(
            locale === "zh" ? "zh-CN" : "en-US",
            {
              dateStyle: "medium",
              timeStyle: "short",
            },
          ).format(dt);
          setMsg(t.successScheduled.replace("{time}", timeStr));
          await new Promise((r) => setTimeout(r, 1000));
        } else {
          setMsg(t.success);
        }
        router.push("/life");
        router.refresh();
      } else if (res.status === 401) {
        setMsg(t.unauthorized);
      } else {
        setMsg(j.error ?? String(res.status));
      }
    } catch {
      setMsg("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div data-lively-exclude>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.secretHint}</p>

        <form onSubmit={onSubmit} className="mt-8 max-w-lg space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground">
              {t.secretLabel}
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              {t.textLabel}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              {t.imagesLabel}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="mt-1 w-full text-sm text-muted-foreground"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">
              {t.scheduleModeLabel}
            </legend>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="scheduleMode"
                checked={!scheduleLater}
                onChange={() => setScheduleLater(false)}
              />
              {t.scheduleImmediate}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="scheduleMode"
                checked={scheduleLater}
                onChange={() => {
                  setScheduleLater(true);
                  setPublishAtLocal((prev) => prev || defaultScheduled);
                }}
              />
              {t.scheduleLater}
            </label>
          </fieldset>

          {scheduleLater ? (
            <div>
              <label className="block text-sm font-medium text-foreground">
                {t.scheduleTimeLabel}
              </label>
              <input
                type="datetime-local"
                value={publishAtLocal}
                onChange={(e) => setPublishAtLocal(e.target.value)}
                min={minLocal}
                max={maxLocal}
                required={scheduleLater}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">{t.scheduleHint}</p>
            </div>
          ) : null}

          {msg ? (
            <p className="text-sm text-muted-foreground" role="status">
              {msg}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "…" : t.submit}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
