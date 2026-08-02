/**
 * Formatting helpers for admin screens.
 *
 * All formatters pin an explicit locale and time zone. Without that, a value
 * formatted on the server and re-formatted on the client can disagree and
 * trigger a hydration mismatch — and dates would silently shift for anyone
 * outside the office's zone.
 */

import { CURRENCY, type Cents, type IsoDate, type IsoDateTime } from "@/lib/domain/types";

const LOCALE = "en-CA";
/** OAX Tech operates out of Calgary. */
export const BUSINESS_TIME_ZONE = "America/Edmonton";

const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
});

/** `125000` → `$1,250`. Use for dashboard figures. */
export function formatMoney(cents: Cents): string {
  return currency.format(cents / 100);
}

/** `125000` → `$1,250.00`. Use for invoices and anything itemised. */
export function formatMoneyPrecise(cents: Cents): string {
  return currencyPrecise.format(cents / 100);
}

const dateShort = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
  timeZone: BUSINESS_TIME_ZONE,
});

const dateWithYear = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: BUSINESS_TIME_ZONE,
});

const dateLong = new Intl.DateTimeFormat(LOCALE, {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: BUSINESS_TIME_ZONE,
});

/**
 * A bare `yyyy-mm-dd` parsed by `new Date()` is treated as UTC midnight, which
 * renders as the *previous* day anywhere west of Greenwich. Appending a time
 * forces local interpretation and keeps the displayed date correct.
 */
function parseDate(value: IsoDate | IsoDateTime): Date {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value);
}

export function formatDate(value: IsoDate | IsoDateTime): string {
  return dateShort.format(parseDate(value));
}

export function formatDateWithYear(value: IsoDate | IsoDateTime): string {
  return dateWithYear.format(parseDate(value));
}

export function formatDateLong(value: IsoDate | IsoDateTime): string {
  return dateLong.format(parseDate(value));
}

/** `"14:30"` → `"2:30 PM"`. */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** Compact relative label for activity feeds. */
export function formatRelative(value: IsoDateTime, now: Date = new Date()): string {
  const then = parseDate(value);
  const diffMs = now.getTime() - then.getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

/** Time-appropriate greeting for the dashboard header. */
export function greeting(now: Date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: BUSINESS_TIME_ZONE,
    }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Percentage delta between two counts, or null when there's no baseline. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
