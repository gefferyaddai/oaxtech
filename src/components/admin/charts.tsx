"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/lib/admin/format";
import type { LeadSourcePoint, RevenuePoint } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Chart colours come from the design tokens, not from Recharts' defaults.
 * Kept as literals because Recharts needs concrete values for SVG fills.
 * These MUST stay in sync with tailwind.config.ts.
 */
const COLORS = {
  cobalt: "#2867FF",
  success: "#0F7A4A",
  warning: "#9A6100",
  slate: "#4E5566",
  muted: "#5E6675",
  line: "#E3DFD5",
} as const;

/** Distinguishable in greyscale as well as colour. */
const SOURCE_COLORS = ["#2867FF", "#0F7A4A", "#9A6100", "#5E6675", "#8B5CF6"];

const RANGES = ["3M", "6M", "12M"] as const;
type Range = (typeof RANGES)[number];

/* -------------------------------------------------------------------------- */
/* Revenue                                                                     */
/* -------------------------------------------------------------------------- */

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

function MoneyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2 shadow-card">
      <p className="text-2xs font-semibold uppercase tracking-wide text-slate">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate">{entry.name}</span>
            <span className="ml-auto font-medium tabular-nums text-ink">
              {formatMoney(Number(entry.value ?? 0))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const [range, setRange] = useState<Range>("6M");
  const months = range === "3M" ? 3 : range === "6M" ? 6 : 12;
  const visible = data.slice(-months);

  /*
   * Revenue is not derived from invoices yet, so with a database configured the
   * series arrives empty. Drawing empty axes with a $0 total would read as "you
   * earned nothing" rather than "this is not wired up", which is the more
   * damaging of the two misreadings on a money panel.
   */
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate">
        Revenue reporting isn&apos;t connected yet, so no figures are shown here.
      </p>
    );
  }

  const total = visible.reduce((sum, point) => sum + point.revenue, 0);
  const outstanding = visible.reduce((sum, point) => sum + point.outstanding, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-2xs uppercase tracking-wide text-slate">
            Total revenue · last {months} months
          </p>
          <p className="mt-0.5 font-display text-2xl font-semibold text-ink">
            {formatMoney(total)}
          </p>
          <p className="mt-0.5 text-xs text-slate">
            {formatMoney(outstanding)} still outstanding
          </p>
        </div>

        <div
          role="group"
          aria-label="Select date range"
          className="inline-flex overflow-hidden rounded-md border border-line"
        >
          {RANGES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              aria-pressed={range === option}
              className={cn(
                "min-h-[2rem] px-3 text-xs font-medium transition-colors",
                range === option
                  ? "bg-cobalt text-white"
                  : "bg-paper text-slate hover:bg-mist",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed height: ResponsiveContainer needs a bounded parent or it
          collapses to zero and the chart never appears. */}
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visible} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.cobalt} stopOpacity={0.22} />
                <stop offset="100%" stopColor={COLORS.cobalt} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: COLORS.line }}
              tick={{ fill: COLORS.muted, fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tick={{ fill: COLORS.muted, fontSize: 11 }}
              tickFormatter={(value: number) => formatMoney(value)}
            />
            <Tooltip content={<MoneyTooltip />} cursor={{ stroke: COLORS.line }} />
            <Legend
              verticalAlign="top"
              align="left"
              height={28}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: COLORS.slate }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={COLORS.cobalt}
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
            <Area
              type="monotone"
              dataKey="payments"
              name="Payments"
              stroke={COLORS.success}
              strokeWidth={2}
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="outstanding"
              name="Outstanding"
              stroke={COLORS.warning}
              strokeWidth={2}
              strokeDasharray="4 3"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Lead sources                                                                */
/* -------------------------------------------------------------------------- */

export function LeadSourcesChart({ data }: { data: LeadSourcePoint[] }) {
  const total = data.reduce((sum, point) => sum + point.count, 0);

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate">
        No lead-source data for this period yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative h-40 w-full shrink-0 sm:w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="source"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((point, index) => (
                <Cell key={point.source} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${Number(value ?? 0)} leads`, String(name ?? "")]}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${COLORS.line}`,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-semibold text-ink">{total}</span>
          <span className="text-2xs text-slate">leads</span>
        </div>
      </div>

      {/* The list carries the numbers, so the donut is never the only source
          of the information. */}
      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((point, index) => {
          const share = Math.round((point.count / total) * 100);
          return (
            <li key={point.source} className="flex items-center gap-2 text-xs">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: SOURCE_COLORS[index % SOURCE_COLORS.length] }}
              />
              <span className="min-w-0 flex-1 truncate text-slate">{point.source}</span>
              <span className="shrink-0 tabular-nums text-muted">{point.count}</span>
              <span className="w-9 shrink-0 text-right font-medium tabular-nums text-ink">
                {share}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

