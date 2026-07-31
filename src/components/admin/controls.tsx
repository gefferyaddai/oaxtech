"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* SearchInput                                                                 */
/* -------------------------------------------------------------------------- */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Visible label is usually redundant beside an obvious magnifier icon. */
  label: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label,
  className,
}: SearchInputProps) {
  const id = useId();
  return (
    <div className={cn("relative min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon
        name="Search"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="field-control min-h-[2.25rem] py-1.5 pl-9 pr-3 text-sm"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FilterDropdown                                                              */
/* -------------------------------------------------------------------------- */

interface FilterDropdownProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  /** Label for the "no filter" option. */
  allLabel?: string;
  className?: string;
}

/**
 * A native <select>. Deliberately not a custom listbox: the native control is
 * keyboard-accessible, screen-reader correct and usable on touch for free.
 */
export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  allLabel = "All",
  className,
}: FilterDropdownProps) {
  const id = useId();
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-control min-h-[2.25rem] py-1.5 text-sm"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DataTable                                                                   */
/* -------------------------------------------------------------------------- */

export interface Column<T> {
  key: string;
  header: string;
  /** Cell renderer. */
  cell: (row: T) => React.ReactNode;
  /** Value used for sorting. Omit to make the column unsortable. */
  sortValue?: (row: T) => string | number;
  /** Right-aligns the column, for numbers and action menus. */
  align?: "left" | "right";
  /** Applied to both the header and cells. */
  className?: string;
  /** Hides the column below the given breakpoint to protect narrow screens. */
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Accessible name for the table. */
  caption: string;
  /** Rendered when `rows` is empty. */
  empty?: React.ReactNode;
  /** Minimum width before the container scrolls horizontally. */
  minWidth?: string;
  onRowClick?: (row: T) => void;
}

const HIDE_CLASS = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

/**
 * Sortable table. The wrapper scrolls horizontally on its own so a wide table
 * can never push the page into horizontal overflow.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  caption,
  empty,
  minWidth = "44rem",
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  if (rows.length === 0 && empty) return <>{empty}</>;

  const sortColumn = columns.find((column) => column.key === sortKey);
  const sorted = sortColumn?.sortValue
    ? [...rows].sort((a, b) => {
        const av = sortColumn.sortValue!(a);
        const bv = sortColumn.sortValue!(b);
        const result =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
        return direction === "asc" ? result : -result;
      })
    : rows;

  function toggleSort(key: string) {
    if (sortKey === key) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  }

  return (
    <div className="table-scroll">
      <table className="w-full text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={
                  sortKey === column.key
                    ? direction === "asc"
                      ? "ascending"
                      : "descending"
                    : column.sortValue
                      ? "none"
                      : undefined
                }
                className={cn(
                  "whitespace-nowrap px-3 py-2.5 text-2xs font-semibold uppercase tracking-wide text-slate",
                  column.align === "right" && "text-right",
                  column.hideBelow && HIDE_CLASS[column.hideBelow],
                  column.className,
                )}
              >
                {column.sortValue ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded transition-colors hover:text-ink",
                      column.align === "right" && "flex-row-reverse",
                    )}
                  >
                    {column.header}
                    <Icon
                      name={
                        sortKey === column.key
                          ? direction === "asc"
                            ? "ChevronUp"
                            : "ChevronDown"
                          : "ArrowUpDown"
                      }
                      className="h-3 w-3 shrink-0"
                    />
                    <span className="sr-only">
                      {sortKey === column.key
                        ? `sorted ${direction === "asc" ? "ascending" : "descending"}`
                        : "sort by this column"}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-line-subtle last:border-0",
                onRowClick && "cursor-pointer transition-colors hover:bg-mist",
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-3 py-3 align-middle",
                    column.align === "right" && "text-right",
                    column.hideBelow && HIDE_CLASS[column.hideBelow],
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dialog — shared modal shell                                                 */
/* -------------------------------------------------------------------------- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Accessible modal: labelled, focus-trapped, Escape-closable, restores focus to
 * whatever was focused when it opened, and locks background scroll.
 */
export function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable.length) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink/50 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-paper shadow-float animate-fade-up sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-base font-semibold text-ink">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-slate">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate transition-colors hover:bg-mist"
          >
            <Icon name="X" className="h-4.5 w-4.5" label="Close dialog" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ConfirmationDialog                                                          */
/* -------------------------------------------------------------------------- */

interface ConfirmationDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  /** Financial, destructive and access-granting actions use "danger". */
  tone?: "danger" | "default";
}

/**
 * Required before any financial, deletion, access or publishing action. The
 * confirm button is never the initially-focused element, so Enter cannot
 * accidentally trigger it.
 */
export function ConfirmationDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "default",
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      footer={
        <>
          <button type="button" onClick={onCancel} className="btn btn-sm btn-neutral">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "btn btn-sm",
              tone === "danger" ? "btn-primary !bg-danger hover:!bg-danger/90" : "btn-primary",
            )}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate">
        This action is not reversible from this screen. Please confirm you want to continue.
      </p>
    </Dialog>
  );
}
