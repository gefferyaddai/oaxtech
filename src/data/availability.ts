/**
 * ============================================================================
 * SAMPLE AVAILABILITY — NOT CONNECTED TO A REAL CALENDAR
 * ============================================================================
 *
 * These are illustrative time slots used to demonstrate the booking interface.
 * They are NOT synced with anyone's calendar, and choosing one does not reserve
 * anything. The booking UI states this plainly to the visitor.
 *
 * To go live:
 *   1. Set CALENDAR_API_KEY (see .env.example).
 *   2. Implement `createCalendarBooking` in src/lib/integrations/index.ts.
 *   3. Replace `getAvailableSlots` below with a real availability query.
 *
 * Until step 3 is done, `IS_SAMPLE_AVAILABILITY` stays true and every surface
 * that shows a time slot renders a "sample times" notice.
 */

export const IS_SAMPLE_AVAILABILITY = true;

/** Times offered on an available weekday, 24h local. */
export const SAMPLE_DAILY_SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00"] as const;

/** 0 = Sunday. Weekdays only in the sample configuration. */
export const AVAILABLE_WEEKDAYS = [1, 2, 3, 4, 5];

/** How far ahead a visitor may book, and the minimum notice required. */
export const BOOKING_WINDOW = {
  minNoticeDays: 1,
  maxAdvanceDays: 60,
};

export interface DayAvailability {
  /** yyyy-mm-dd */
  date: string;
  available: boolean;
  slots: string[];
}

function toKey(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Returns sample availability for a given month.
 * Deterministic, so server and client render identically (no hydration drift).
 */
export function getMonthAvailability(year: number, monthIndex: number): DayAvailability[] {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const earliest = new Date(today);
  earliest.setDate(earliest.getDate() + BOOKING_WINDOW.minNoticeDays);

  const latest = new Date(today);
  latest.setDate(latest.getDate() + BOOKING_WINDOW.maxAdvanceDays);

  const result: DayAvailability[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day);
    const withinWindow = date >= earliest && date <= latest;
    const isWorkday = AVAILABLE_WEEKDAYS.includes(date.getDay());
    const available = withinWindow && isWorkday;
    result.push({
      date: toKey(date),
      available,
      slots: available ? [...SAMPLE_DAILY_SLOTS] : [],
    });
  }
  void first;
  return result;
}

export function getAvailableSlots(dateKey: string): string[] {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return [];
  const month = getMonthAvailability(y, m - 1);
  return month.find((entry) => entry.date === dateKey)?.slots ?? [];
}

/** Formats "13:00" as "1:00 PM". */
export function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  if (h === undefined || m === undefined) return slot;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${`${m}`.padStart(2, "0")} ${period}`;
}

/** What the visitor will be told about the consultation itself. */
export const CONSULTATION_DETAILS = {
  durationMinutes: 30,
  priceLabel: "Free consultation",
  obligationLabel: "No obligation",
} as const;

export const whatToExpect = [
  { label: "Discuss Your Idea", icon: "MessageSquare", description: "We'll listen to your goals, challenges and vision." },
  { label: "Identify Your Goals", icon: "Target", description: "We'll define what success looks like for your business." },
  { label: "Recommend a Solution", icon: "Lightbulb", description: "We'll suggest the right approach and technology." },
  { label: "Pricing & Next Steps", icon: "FileText", description: "We'll outline investment options and the next steps." },
];
