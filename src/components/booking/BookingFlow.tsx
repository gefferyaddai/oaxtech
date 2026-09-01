"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormOutcome, submitForm } from "@/components/forms/FormStatus";
import {
  FormField,
  HoneypotField,
  RadioCardGroup,
  SelectField,
  TextareaField,
} from "@/components/forms/Fields";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ErrorState } from "@/components/ui/States";
import {
  type DayAvailability,
  BOOKING_WINDOW,
  CONSULTATION_DETAILS,
  formatSlot,
  getMonthAvailability,
} from "@/data/availability";
import type { SubmissionOutcome } from "@/lib/integrations";
import {
  BOOKING_BUDGETS,
  bookingSchema,
  type BookingInput,
} from "@/lib/validation/schemas";
import { cn, formatDateLong, formatMonthYear } from "@/lib/utils";

const SERVICE_OPTIONS = [
  { value: "Website Development", label: "Website Development", description: "websites, redesigns and e-commerce", icon: "Monitor" },
  { value: "Custom Software", label: "Custom Software", description: "applications, portals and automation", icon: "Code2" },
  { value: "Marketing Consulting", label: "Marketing Consulting", description: "strategy, campaigns and growth", icon: "BarChart3" },
  { value: "SEO", label: "SEO", description: "audits, local SEO and ongoing optimization", icon: "Search" },
  { value: "General Consultation", label: "General Consultation", description: "not sure yet, or multiple needs", icon: "MessageSquare" },
];

const STEPS = ["Service", "Date & Time", "Your Details", "Confirmation"] as const;

/** Each step slides in from the direction implied by Back/Continue and fades. */
const stepVariants = {
  enter: { opacity: 0, x: 16 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};
const stepTransition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [serviceError, setServiceError] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [dateError, setDateError] = useState<string>();
  const [timeZone, setTimeZone] = useState<string>("");
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);

  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  /**
   * Time zone is read from the browser after mount. Doing it during render
   * would produce a server/client mismatch, since the server has no idea where
   * the visitor is.
   */
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({ resolver: zodResolver(bookingSchema) });

  useEffect(() => {
    setValue("service", service as BookingInput["service"]);
    setValue("date", selectedDate);
    setValue("time", selectedSlot);
    setValue("timeZone", timeZone);
  }, [service, selectedDate, selectedSlot, timeZone, setValue]);

  /**
   * ==========================================================================
   * LIVE AVAILABILITY
   * ==========================================================================
   *
   * Seeded with the local sample grid so the calendar has structure on the
   * very first paint, then replaced by whatever /api/availability returns for
   * the month in view. The endpoint answers with real Cal.com slots when the
   * calendar is configured and the sample grid when it is not, and says which
   * it gave us — so `isSample` is learned from the server rather than compiled
   * in, and connecting a calendar needs no change here.
   *
   * Fetching per month rather than all at once: availability changes while
   * someone is deciding, and a month they never open should not be queried.
   */
  const [availability, setAvailability] = useState<DayAvailability[]>(() =>
    getMonthAvailability(viewMonth.getFullYear(), viewMonth.getMonth()),
  );
  const [isSample, setIsSample] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string>();

  useEffect(() => {
    // Wait for the browser's zone — asking before it resolves would query the
    // wrong day boundaries for anyone outside the server's zone.
    if (!timeZone) return;

    const controller = new AbortController();
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();

    setLoadingSlots(true);
    setAvailabilityError(undefined);

    const query = new URLSearchParams({
      year: String(year),
      month: String(month),
      timeZone,
    });

    fetch(`/api/availability?${query}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as {
          isSample?: boolean;
          days?: DayAvailability[];
          error?: string;
        };

        if (!response.ok) {
          // Configured but unreachable. Show nothing bookable and say so —
          // never fall back to sample times dressed up as real ones.
          setAvailability([]);
          setIsSample(false);
          setAvailabilityError(
            "We couldn't load the live calendar just now. Please try again in a moment, or send us a message and we'll arrange a time.",
          );
          return;
        }

        setAvailability(payload.days ?? []);
        setIsSample(payload.isSample !== false);
      })
      .catch((error: unknown) => {
        if ((error as Error)?.name === "AbortError") return;
        setAvailability([]);
        setIsSample(false);
        setAvailabilityError(
          "We couldn't reach the booking calendar. Please try again, or send us a message and we'll arrange a time.",
        );
      })
      .finally(() => {
        // The abort path has already been superseded by a newer request, which
        // owns the loading flag from here.
        if (!controller.signal.aborted) setLoadingSlots(false);
      });

    return () => controller.abort();
  }, [viewMonth, timeZone]);

  /*
   * A date chosen in one month must not stay selected once the visitor pages
   * to another, or the summary would show a day that is no longer on screen.
   */
  useEffect(() => {
    setSelectedDate("");
    setSelectedSlot("");
  }, [viewMonth]);

  const slots = useMemo(
    () => availability.find((d) => d.date === selectedDate)?.slots ?? [],
    [availability, selectedDate],
  );

  const description = watch("description") ?? "";

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW.maxAdvanceDays);
  const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  function goNext() {
    if (step === 0) {
      if (!service) {
        setServiceError("Choose the service you'd like to talk about.");
        return;
      }
      setServiceError(undefined);
    }
    if (step === 1) {
      if (!selectedDate || !selectedSlot) {
        setDateError("Choose both a date and a time to continue.");
        return;
      }
      setDateError(undefined);
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(values: BookingInput) {
    setOutcome(null);
    const result = await submitForm("/api/booking", values);
    setOutcome(result);
    setStep(3);
  }

  // Leading blank cells so the 1st lands on the correct weekday column.
  const firstWeekday = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();

  return (
    <div>
      {/* Progress ------------------------------------------------------------ */}
      <ol className="card flex flex-wrap items-center gap-x-2 gap-y-3 p-4 sm:gap-x-4" aria-label="Booking steps">
        {STEPS.map((label, index) => {
          const state = index < step ? "done" : index === step ? "current" : "upcoming";
          return (
            <li key={label} className="flex flex-1 items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  state === "done" && "bg-success text-white",
                  state === "current" && "bg-cobalt text-white",
                  state === "upcoming" && "border border-line-strong text-muted",
                )}
              >
                {state === "done" ? <Icon name="Check" className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-xs sm:text-sm",
                  state === "current" ? "font-medium text-cobalt" : "text-slate",
                )}
              >
                {label}
                {state === "current" && <span className="sr-only"> (current step)</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
      {/* Step 1 — service ---------------------------------------------------- */}
      {step === 0 && (
        <motion.div
          key="step-0"
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          className="card mt-5 p-5 sm:p-6"
        >
          <h2 className="font-display text-lg font-semibold text-ink">Choose a Service</h2>
          <div className="mt-5">
            <RadioCardGroup
              legend="What would you like to discuss?"
              name="booking-service"
              options={SERVICE_OPTIONS}
              value={service}
              onChange={(v) => {
                setService(v);
                setServiceError(undefined);
              }}
              error={serviceError}
              required
              columns={2}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={goNext} variant="primary" iconRight="ArrowRight">
              Continue
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2 — date and time ---------------------------------------------- */}
      {step === 1 && (
        <motion.div
          key="step-1"
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          className="card mt-5 p-5 sm:p-6"
        >
          <h2 className="font-display text-lg font-semibold text-ink">Select a Date and Time</h2>

          {/* Three states, and they are mutually exclusive: the live calendar
              is unreachable, the calendar isn't connected at all, or these are
              real bookable times and no notice is needed. */}
          {availabilityError ? (
            <div className="mt-4">
              <ErrorState
                variant="config"
                title="Couldn't load available times"
                description={availabilityError}
              />
            </div>
          ) : (
            isSample && (
              <div className="mt-4">
                <ErrorState
                  variant="config"
                  title="These are sample times"
                  description="This calendar isn't connected to a live booking system yet, so the times below are examples. We'll confirm a real time with you by email."
                />
              </div>
            )
          )}

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                  disabled={viewMonth <= minMonth}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line disabled:opacity-40"
                >
                  <Icon name="ChevronLeft" className="h-4 w-4" label="Previous month" />
                </button>
                <p className="font-display text-sm font-semibold text-ink" aria-live="polite">
                  {formatMonthYear(viewMonth)}
                </p>
                <button
                  type="button"
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                  disabled={viewMonth >= maxMonth}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line disabled:opacity-40"
                >
                  <Icon name="ChevronRight" className="h-4 w-4" label="Next month" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-1" role="grid" aria-label="Available dates">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="py-1.5 text-center text-2xs font-medium text-muted">
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstWeekday }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {availability.map((day) => {
                  const dayNumber = Number(day.date.split("-")[2]);
                  const isSelected = day.date === selectedDate;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={!day.available}
                      aria-pressed={isSelected}
                      aria-label={`${formatDateLong(new Date(`${day.date}T12:00:00`))}${day.available ? "" : " — unavailable"}`}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedSlot("");
                        setDateError(undefined);
                      }}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-md border text-sm transition-colors",
                        isSelected && "border-cobalt bg-cobalt font-medium text-white",
                        !isSelected && day.available && "border-cobalt-border bg-paper text-ink hover:bg-cobalt-soft",
                        !day.available && "cursor-not-allowed border-transparent bg-haze text-muted",
                      )}
                    >
                      {dayNumber}
                    </button>
                  );
                })}
              </div>

              <ul className="mt-4 flex flex-wrap gap-4 text-xs text-slate">
                <li className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border border-cobalt-border bg-paper" aria-hidden="true" />
                  Available
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-cobalt" aria-hidden="true" />
                  Selected
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-haze" aria-hidden="true" />
                  Unavailable
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold text-ink">Available Times</h3>
              <p className="mt-1 text-xs text-muted">
                {timeZone ? (
                  <>
                    Time zone: {timeZone} — detected from your browser
                  </>
                ) : (
                  "Detecting your time zone…"
                )}
              </p>

              {loadingSlots ? (
                <p
                  /* Polite, not assertive: the visitor is reading the calendar,
                     and this should not interrupt what a screen reader is on. */
                  aria-live="polite"
                  className="mt-4 rounded-lg border border-dashed border-line-strong bg-mist p-4 text-sm text-slate"
                >
                  Checking available times…
                </p>
              ) : !selectedDate ? (
                <p className="mt-4 rounded-lg border border-dashed border-line-strong bg-mist p-4 text-sm text-slate">
                  Pick a date to see times.
                </p>
              ) : slots.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-line-strong bg-mist p-4 text-sm text-slate">
                  {isSample
                    ? "No sample times on this date. Try another day."
                    : "Nothing free on this date. Try another day."}
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {slots.map((slot) => (
                    <li key={slot}>
                      <button
                        type="button"
                        aria-pressed={slot === selectedSlot}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setDateError(undefined);
                        }}
                        className={cn(
                          "w-full rounded-md border px-4 py-2.5 text-sm transition-colors",
                          slot === selectedSlot
                            ? "border-cobalt bg-cobalt font-medium text-white"
                            : "border-line bg-paper text-ink hover:border-line-strong",
                        )}
                      >
                        {formatSlot(slot)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 flex items-start gap-2 text-xs text-muted">
                <Icon name="Info" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Times are shown in your local time zone.
              </p>
            </div>
          </div>

          {dateError && (
            <p className="mt-4 flex items-start gap-1.5 text-xs text-danger" role="alert">
              <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {dateError}
            </p>
          )}

          <div className="mt-6 flex justify-between gap-3">
            <Button onClick={() => setStep(0)} variant="neutral" iconLeft="ArrowLeft">
              Back
            </Button>
            <Button onClick={goNext} variant="primary" iconRight="ArrowRight">
              Continue
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3 — details ---------------------------------------------------- */}
      {step === 2 && (
        <motion.form
          key="step-2"
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_0.6fr]"
        >
          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Tell Us About You</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Name" required autoComplete="name" placeholder="Your full name" error={errors.name?.message} {...register("name")} />
              <FormField label="Email" type="email" required autoComplete="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
              <FormField label="Phone number" type="tel" required autoComplete="tel" placeholder="Best number to reach you" error={errors.phone?.message} {...register("phone")} />
              <FormField label="Company name" required autoComplete="organization" placeholder="Your company name" error={errors.companyName?.message} {...register("companyName")} />
              <FormField label="Current website (optional)" type="url" placeholder="https://yourwebsite.com" error={errors.currentWebsite?.message} {...register("currentWebsite")} />
              <SelectField label="Budget range" placeholder="Select your budget range" options={BOOKING_BUDGETS} error={errors.budget?.message} {...register("budget")} />
            </div>

            <div className="mt-4">
              <TextareaField
                label="Project description"
                required
                rows={5}
                maxLength={1000}
                currentLength={description.length}
                placeholder="Tell us what you're looking to build, improve or grow."
                error={errors.description?.message}
                {...register("description")}
              />
            </div>

            <HoneypotField {...register("company_website")} />
            <input type="hidden" {...register("service")} />
            <input type="hidden" {...register("date")} />
            <input type="hidden" {...register("time")} />
            <input type="hidden" {...register("timeZone")} />

            <p className="mt-4 flex items-start gap-2 text-xs text-muted">
              <Icon name="Lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Your information is secure and will never be shared.
            </p>

            <div className="mt-5 flex justify-between gap-3">
              <Button onClick={() => setStep(1)} variant="neutral" iconLeft="ArrowLeft" type="button">
                Back
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="card h-fit p-5 sm:p-6">
            <h2 className="font-display text-base font-semibold text-ink">Booking Summary</h2>
            <dl className="mt-5 space-y-4">
              <div className="flex gap-3">
                <Icon name="Clock" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cobalt" />
                <div>
                  <dt className="text-sm font-medium text-ink">{CONSULTATION_DETAILS.priceLabel}</dt>
                  <dd className="text-sm text-slate">{CONSULTATION_DETAILS.durationMinutes} minutes</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="Monitor" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cobalt" />
                <div>
                  <dt className="text-sm font-medium text-ink">Service</dt>
                  <dd className="text-sm text-slate">{service || "Not selected"}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="Calendar" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cobalt" />
                <div>
                  <dt className="text-sm font-medium text-ink">Date & Time</dt>
                  <dd className="text-sm text-slate">
                    {selectedDate ? formatDateLong(new Date(`${selectedDate}T12:00:00`)) : "Not selected"}
                    {selectedSlot && <><br />{formatSlot(selectedSlot)}</>}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="Globe" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cobalt" />
                <div>
                  <dt className="text-sm font-medium text-ink">Time Zone</dt>
                  <dd className="text-sm text-slate">{timeZone || "Detecting…"}</dd>
                </div>
              </div>
            </dl>

            <Button type="submit" variant="primary" fullWidth className="mt-6" loading={isSubmitting} loadingLabel="Submitting…">
              Confirm Booking
            </Button>

            <p className="mt-3 text-center text-xs text-slate">
              Need help?{" "}
              <a href="/contact" className="font-medium text-cobalt underline underline-offset-2">
                Contact us
              </a>
            </p>
          </div>
        </motion.form>
      )}

      {/* Step 4 — outcome ---------------------------------------------------- */}
      {step === 3 && (
        <motion.div
          key="step-3"
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          className="card mt-5 p-5 sm:p-6"
        >
          <h2 className="font-display text-lg font-semibold text-ink">Confirmation</h2>
          <div className="mt-5">
            <FormOutcome
              outcome={outcome}
              successTitle="Your consultation is booked"
              /* Only `delivered` means a calendar actually reserved the slot.
                 A received request must not claim to be booked. */
              receivedTitle="Request received — we'll confirm your time"
              successBody={
                <>
                  {service} — {selectedDate && formatDateLong(new Date(`${selectedDate}T12:00:00`))} at{" "}
                  {selectedSlot && formatSlot(selectedSlot)} ({timeZone}).
                </>
              }
              fallbackAction={
                <ButtonLink href="/contact" variant="outline" size="sm">
                  Send us a message instead
                </ButtonLink>
              }
            />
          </div>

          {/* Reschedule and cancel are inert while no calendar backend exists. */}
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs text-muted">
              Reschedule and cancel become available once a calendar integration is connected. Until
              then, reply to our email and we&apos;ll sort it out with you directly.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled className="btn btn-sm btn-neutral" title="Available once a calendar is connected">
                <Icon name="RefreshCw" className="h-4 w-4" />
                Reschedule
              </button>
              <button type="button" disabled className="btn btn-sm btn-neutral" title="Available once a calendar is connected">
                <Icon name="X" className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setStep(0)} variant="neutral" type="button">
              Start again
            </Button>
            <ButtonLink href="/" variant="ghost">
              Return home
            </ButtonLink>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      </MotionConfig>
    </div>
  );
}
