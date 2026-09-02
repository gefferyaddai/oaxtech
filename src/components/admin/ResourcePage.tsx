"use client";

import { useMemo, useState } from "react";
import {
  ConfirmationDialog,
  DataTable,
  Dialog,
  FilterDropdown,
  SearchInput,
  type Column,
} from "@/components/admin/controls";
import { AdminCard, PageHeader } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

export interface ResourceFilter {
  label: string;
  options: readonly string[];
  allLabel?: string;
  /** Reads the value this filter matches against. */
  match: (row: never) => string;
}

interface ResourcePageProps<T> {
  title: string;
  description: string;
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Fields searched by the search box. */
  searchable: (row: T) => string;
  searchPlaceholder: string;
  filter?: {
    label: string;
    options: readonly string[];
    allLabel?: string;
    match: (row: T) => string;
  };
  /** Label for the primary create action. */
  createLabel: string;
  /**
   * What creating a record will do once a backend exists. Shown in the create
   * dialog instead of a form that would silently discard input.
   */
  createDescription: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon?: string;
  minWidth?: string;
  /** Opens the create dialog on mount, for `?create=…` deep links. */
  autoOpenCreate?: boolean;
  /** Set when the create action is financial, destructive or publishing. */
  createNeedsConfirmation?: boolean;
}

/**
 * The shared shell behind every non-overview admin section.
 *
 * Guarantees each one has a real header, working search, relevant filters, a
 * sortable table, and genuine loading / empty / error states — rather than a
 * stub page behind a working nav link.
 */
export function ResourcePage<T>({
  title,
  description,
  rows,
  columns,
  rowKey,
  searchable,
  searchPlaceholder,
  filter,
  createLabel,
  createDescription,
  emptyTitle,
  emptyDescription,
  emptyIcon = "Inbox",
  minWidth,
  autoOpenCreate,
  createNeedsConfirmation,
}: ResourcePageProps<T>) {
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [createOpen, setCreateOpen] = useState(Boolean(autoOpenCreate));
  const [confirmOpen, setConfirmOpen] = useState(false);
  /** Exercises the loading and error branches without a backend. */
  const [view, setView] = useState<"ready" | "loading" | "error">("ready");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter && filterValue && filter.match(row) !== filterValue) return false;
      if (!q) return true;
      return searchable(row).toLowerCase().includes(q);
    });
  }, [rows, query, filterValue, filter, searchable]);

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <button
            type="button"
            onClick={() => (createNeedsConfirmation ? setConfirmOpen(true) : setCreateOpen(true))}
            className="btn btn-sm btn-primary"
          >
            <Icon name="Plus" className="h-4 w-4" />
            {createLabel}
          </button>
        }
      />

      <AdminCard className="mt-5" flush>
        <div className="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
          <SearchInput
            label={`Search ${title.toLowerCase()}`}
            value={query}
            onChange={setQuery}
            placeholder={searchPlaceholder}
            className="sm:max-w-xs"
          />
          {filter && (
            <FilterDropdown
              label={filter.label}
              value={filterValue}
              onChange={setFilterValue}
              options={filter.options}
              allLabel={filter.allLabel}
              className="sm:w-52"
            />
          )}
          <div className="flex items-center gap-2 sm:ml-auto">
            <p className="text-xs text-slate">
              {filtered.length} of {rows.length}
            </p>
            {/*
              Without a backend there is no way to reach the loading or error
              branches. This exposes them so both are verifiable now and stay
              correct once real requests exist.
            */}
            <label className="sr-only" htmlFor={`${title}-state`}>
              Preview data state
            </label>
            <select
              id={`${title}-state`}
              value={view}
              onChange={(event) => setView(event.target.value as typeof view)}
              className="field-control min-h-[2rem] w-28 py-1 text-2xs"
              title="Preview the loading and error states"
            >
              <option value="ready">Ready</option>
              <option value="loading">Loading</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-5">
          {view === "loading" && <LoadingState label={`Loading ${title.toLowerCase()}…`} />}

          {view === "error" && (
            <ErrorState
              title={`Couldn't load ${title.toLowerCase()}`}
              description="The request failed. The rest of the admin is unaffected."
              action={
                <button type="button" onClick={() => setView("ready")} className="btn btn-sm btn-neutral">
                  <Icon name="RefreshCw" className="h-3.5 w-3.5" />
                  Try again
                </button>
              }
            />
          )}

          {view === "ready" && (
            <DataTable
              rows={filtered}
              columns={columns}
              rowKey={rowKey}
              caption={title}
              minWidth={minWidth}
              empty={
                <EmptyState
                  icon={emptyIcon}
                  title={query || filterValue ? `No ${title.toLowerCase()} match those filters` : emptyTitle}
                  description={
                    query || filterValue
                      ? "Try a different search term or clear the filter."
                      : emptyDescription
                  }
                />
              }
            />
          )}
        </div>
      </AdminCard>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={createLabel}
        description={createDescription}
        footer={
          <button type="button" onClick={() => setCreateOpen(false)} className="btn btn-sm btn-neutral">
            Close
          </button>
        }
      >
        {/*
          * This says the form is not built, NOT that the database is missing.
          *
          * It used to blame an unset DATABASE_URL, and that text is hardcoded —
          * it never checked whether one was configured. In production, with
          * Postgres connected and every list on this screen reading live rows,
          * all twelve of these dialogs still told the operator there was no
          * database. An admin that misreports its own state is worse than one
          * that admits a gap, because the first thing it costs is the
          * operator's trust in the panels that ARE correct.
          *
          * The real blocker is the same either way: no create form is wired to
          * this section. Some sections have a server action waiting
          * (`createLeadAction`, `createClientAction`, `createTaskAction`);
          * others have no mutation at all yet.
          */}
        <div className="rounded-lg border border-info/25 bg-info-soft p-3">
          <p className="flex items-start gap-2 text-sm text-charcoal">
            <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0 text-info" />
            <span>
              Creating records from this screen isn&apos;t available yet. Records added
              elsewhere — including anything submitted through the website — appear here
              as normal.
            </span>
          </p>
        </div>
      </Dialog>

      <ConfirmationDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setCreateOpen(true);
        }}
        title={createLabel}
        description="This is a financial or publishing action, so it needs confirmation before continuing."
        confirmLabel="Continue"
      />
    </div>
  );
}
