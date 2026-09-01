/**
 * ============================================================================
 * BOOKING AVAILABILITY
 * ============================================================================
 *
 * GET /api/availability?year=2026&month=8&timeZone=America/Edmonton
 *   month is 0-indexed, matching JavaScript's Date.
 *
 * Returns what is genuinely free when Cal.com is configured, and the sample
 * grid when it is not — with an `isSample` flag so the UI can say which it is
 * showing. The booking step renders a "these are sample times" notice whenever
 * that flag is true, so an unconfigured deployment cannot quietly look live.
 *
 * If Cal.com is configured but the call FAILS, this reports the failure rather
 * than silently falling back to sample data. Offering invented times as though
 * they were real is the one outcome worse than showing an error.
 */

import { NextResponse } from "next/server";
import {
  type DayAvailability,
  BOOKING_WINDOW,
  getMonthAvailability,
} from "@/data/availability";
import { calcomConfig, fetchMonthSlots } from "@/lib/integrations/calcom";

/** Availability is live data — it must never be cached at the edge. */
export const dynamic = "force-dynamic";

export interface AvailabilityResponse {
  /** True when these are illustrative times, not a real calendar. */
  isSample: boolean;
  days: DayAvailability[];
  /** Present only when a configured calendar could not be reached. */
  error?: string;
}

/** Falls back to the visitor's stated zone, then to the business's own. */
const DEFAULT_TIME_ZONE = "America/Edmonton";

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request): Promise<NextResponse<AvailabilityResponse>> {
  const url = new URL(request.url);

  const year = Number(url.searchParams.get("year"));
  const month = Number(url.searchParams.get("month"));
  const requestedZone = url.searchParams.get("timeZone") ?? "";

  // A malformed month index would otherwise walk Date into a different year.
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return NextResponse.json({ isSample: true, days: [] }, { status: 400 });
  }
  if (!Number.isInteger(month) || month < 0 || month > 11) {
    return NextResponse.json({ isSample: true, days: [] }, { status: 400 });
  }

  /*
   * The zone comes from the browser and is interpolated into Intl and into the
   * upstream query string, so it is validated against the runtime's own zone
   * table rather than trusted.
   */
  const timeZone =
    requestedZone && isValidTimeZone(requestedZone) ? requestedZone : DEFAULT_TIME_ZONE;

  const config = calcomConfig();

  if (!config) {
    return NextResponse.json({
      isSample: true,
      days: getMonthAvailability(year, month),
    });
  }

  try {
    const { byDate } = await fetchMonthSlots(config, year, month, timeZone);

    /*
     * The month is rebuilt day by day rather than from Cal.com's keys alone,
     * so the calendar grid still renders every date — a day with no free slots
     * has to appear as unavailable, not go missing.
     *
     * The booking window is still enforced here. Cal.com has its own minimum
     * notice, but this is the site's promise about how far ahead it will take
     * a booking and it should not depend on a remote setting matching.
     */
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const earliest = new Date(today);
    earliest.setDate(earliest.getDate() + BOOKING_WINDOW.minNoticeDays);
    const latest = new Date(today);
    latest.setDate(latest.getDate() + BOOKING_WINDOW.maxAdvanceDays);

    const days: DayAvailability[] = [];
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = `${year}-${`${month + 1}`.padStart(2, "0")}-${`${day}`.padStart(2, "0")}`;
      const withinWindow = date >= earliest && date <= latest;
      const slots = withinWindow ? (byDate[key] ?? []) : [];
      days.push({ date: key, available: slots.length > 0, slots });
    }

    return NextResponse.json({ isSample: false, days });
  } catch (error) {
    /*
     * Configured but unreachable. Return an empty, clearly-failed month so the
     * UI can say the calendar could not be loaded — never sample times dressed
     * up as real ones.
     */
    return NextResponse.json(
      {
        isSample: false,
        days: [],
        error: (error as Error).message,
      },
      { status: 502 },
    );
  }
}
