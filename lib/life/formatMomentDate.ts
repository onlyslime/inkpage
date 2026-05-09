/** 用于动态日期的展示时区（国内站点） */
export const LIFE_TIMEZONE = "Asia/Shanghai";

function calendarPartsInTz(
  d: Date,
  timeZone: string,
): { y: number; m: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === t)?.value ?? 0);
  return {
    y: get("year"),
    m: get("month"),
    day: get("day"),
  };
}

function daysBetweenCalendar(
  a: { y: number; m: number; day: number },
  b: { y: number; m: number; day: number },
): number {
  const da = Date.UTC(a.y, a.m - 1, a.day);
  const db = Date.UTC(b.y, b.m - 1, b.day);
  return Math.round((db - da) / 86400000);
}

/**
 * Compare moment date with current time at day granularity,
 * returning a relative date string (e.g. "2 days ago").
 */
export function formatMomentDate(
  momentDate: Date,
  now: Date,
  locale: "zh" | "en",
): string {
  const t = LIFE_TIMEZONE;
  const md = calendarPartsInTz(momentDate, t);
  const nd = calendarPartsInTz(now, t);
  /** 以日历日为单位：moment 比「今天」早几天（昨天 = +1） */
  const diffDays = daysBetweenCalendar(md, nd);

  if (diffDays === 0) {
    return locale === "zh" ? "今天" : "Today";
  }
  if (diffDays === 1) {
    return locale === "zh" ? "昨天" : "Yesterday";
  }
  if (diffDays === 2) {
    return locale === "zh" ? "前天" : "Two days ago";
  }

  const sameYear = md.y === nd.y;
  const sameMonth = sameYear && md.m === nd.m;

  if (locale === "zh") {
    if (sameMonth) {
      return `${md.day}日`;
    }
    if (sameYear) {
      return `${md.m}月${md.day}日`;
    }
    return `${md.y}年${md.m}月${md.day}日`;
  }

  if (sameMonth && sameYear) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(momentDate);
  }
  if (sameYear) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(momentDate);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(momentDate);
}
