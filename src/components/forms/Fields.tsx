"use client";

import { forwardRef, useId } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Shared wrapper                                                              */
/* -------------------------------------------------------------------------- */

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  errorId: string;
  hintId: string;
  children: React.ReactNode;
  className?: string;
  /** Rendered at the bottom-right, e.g. a character counter. */
  meta?: React.ReactNode;
}

function FieldWrapper({
  label, htmlFor, required, error, hint, errorId, hintId, children, className, meta,
}: FieldWrapperProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      {children}

      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {error ? (
            <p id={errorId} className="flex items-start gap-1.5 text-xs text-danger">
              <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          ) : hint ? (
            <p id={hintId} className="text-xs text-muted">
              {hint}
            </p>
          ) : null}
        </div>
        {meta && <p className="shrink-0 text-xs tabular-nums text-muted">{meta}</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Text input                                                                  */
/* -------------------------------------------------------------------------- */

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, hint, required, wrapperClassName, className, id, ...rest },
  ref,
) {
  const generated = useId();
  const fieldId = id ?? `field-${generated}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <FieldWrapper
      label={label}
      htmlFor={fieldId}
      required={required}
      error={error}
      hint={hint}
      errorId={errorId}
      hintId={hintId}
      className={wrapperClassName}
    >
      <input
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn("field-control", className)}
        {...rest}
      />
    </FieldWrapper>
  );
});

/* -------------------------------------------------------------------------- */
/* Select                                                                      */
/* -------------------------------------------------------------------------- */

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: readonly string[];
  wrapperClassName?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, hint, required, options, placeholder, wrapperClassName, className, id, ...rest },
  ref,
) {
  const generated = useId();
  const fieldId = id ?? `field-${generated}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <FieldWrapper
      label={label}
      htmlFor={fieldId}
      required={required}
      error={error}
      hint={hint}
      errorId={errorId}
      hintId={hintId}
      className={wrapperClassName}
    >
      <select
        ref={ref}
        id={fieldId}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn("field-control", className)}
        {...rest}
      >
        <option value="" disabled>
          {placeholder ?? "Select an option"}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
});

/* -------------------------------------------------------------------------- */
/* Textarea                                                                    */
/* -------------------------------------------------------------------------- */

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Shows an "n / max" counter beneath the field. */
  currentLength?: number;
  wrapperClassName?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    { label, error, hint, required, currentLength, maxLength, wrapperClassName, className, id, ...rest },
    ref,
  ) {
    const generated = useId();
    const fieldId = id ?? `field-${generated}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <FieldWrapper
        label={label}
        htmlFor={fieldId}
        required={required}
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
        className={wrapperClassName}
        meta={
          maxLength ? (
            <>
              <span className="sr-only">Characters used: </span>
              {currentLength ?? 0} / {maxLength}
            </>
          ) : undefined
        }
      >
        <textarea
          ref={ref}
          id={fieldId}
          required={required}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn("field-control", className)}
          {...rest}
        />
      </FieldWrapper>
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Checkbox group                                                              */
/* -------------------------------------------------------------------------- */

interface CheckboxGroupProps {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  hint?: string;
  columns?: 2 | 3 | 4;
}

export function CheckboxGroup({
  label, options, value, onChange, error, hint, columns = 4,
}: CheckboxGroupProps) {
  const groupId = useId();
  const errorId = `${groupId}-error`;

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="field-label">{label}</legend>
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {options.map((option) => {
          const checked = value.includes(option);
          return (
            <label
              key={option}
              className={cn(
                /* Selected state inks the whole option solid rather than tinting it —
                   a mark, not a wash, like every other state in the system. */
                "flex min-h-[2.75rem] cursor-pointer items-center gap-2.5 border-rule px-3 py-2 text-sm transition-colors",
                checked
                  ? "border-graphite bg-graphite text-sheet"
                  : "border-graphite bg-chalk text-graphite hover:bg-sheet-deep",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="h-4 w-4 shrink-0 rounded border-line-strong text-cobalt accent-cobalt"
              />
              {option}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs text-danger">
          <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/* Radio card group                                                            */
/* -------------------------------------------------------------------------- */

interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface RadioCardGroupProps {
  legend: string;
  name: string;
  options: RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  columns?: 1 | 2 | 3;
}

/** Selectable cards, as shown on the booking and quote mockups. */
export function RadioCardGroup({
  legend, name, options, value, onChange, error, required, columns = 3,
}: RadioCardGroupProps) {
  const groupId = useId();
  const errorId = `${groupId}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="field-label">
        {legend}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </legend>
      <div
        className={cn(
          "grid gap-2.5",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 border-rule p-3.5 transition-colors",
                checked
                  ? "border-revision bg-revision-soft"
                  : "border-graphite bg-chalk hover:bg-sheet-deep",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.icon && (
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                    checked ? "bg-paper text-cobalt" : "bg-mist text-cobalt",
                  )}
                >
                  <Icon name={option.icon} className="h-4.5 w-4.5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-xs leading-snug text-slate">
                    {option.description}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  checked ? "border-cobalt bg-cobalt text-white" : "border-line-strong bg-paper",
                )}
                aria-hidden="true"
              >
                {checked && <Icon name="Check" className="h-3 w-3" strokeWidth={3} />}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs text-danger">
          <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/* Honeypot                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Spam trap. Hidden from sighted users and from assistive tech; a real person
 * never fills it in, so any submission with a value is rejected server-side.
 */
export const HoneypotField = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function HoneypotField(props, ref) {
    return (
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input
          ref={ref}
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...props}
        />
      </div>
    );
  },
);
