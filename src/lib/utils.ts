/** Tiny class-name joiner. Avoids pulling in clsx/tailwind-merge as dependencies. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Stable id helper for associating labels, errors and descriptions. */
export function fieldIds(name: string) {
  return {
    input: `field-${name}`,
    error: `field-${name}-error`,
    hint: `field-${name}-hint`,
  };
}

export function formatDateLong(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format(date);
}

/** ISO yyyy-mm-dd in local time (avoids the UTC off-by-one of toISOString). */
export function toDateKey(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}
