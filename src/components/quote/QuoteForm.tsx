"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CheckboxGroup,
  FormField,
  HoneypotField,
  RadioCardGroup,
  SelectField,
  TextareaField,
} from "@/components/forms/Fields";
import { FileUpload } from "@/components/forms/FileUpload";
import { FormOutcome, submitForm } from "@/components/forms/FormStatus";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ErrorState } from "@/components/ui/States";
import type { SubmissionOutcome } from "@/lib/integrations";
import {
  QUOTE_BUDGETS,
  QUOTE_FEATURES,
  QUOTE_PACKAGES,
  QUOTE_PAGE_COUNTS,
  quoteSchema,
  type QuoteInput,
} from "@/lib/validation/schemas";

const SERVICE_OPTIONS = [
  { value: "Website Development", label: "Website Development", icon: "Monitor" },
  { value: "Custom Software", label: "Custom Software", icon: "Code2" },
  { value: "Marketing Consulting", label: "Marketing Consulting", icon: "BarChart3" },
  { value: "SEO", label: "SEO", icon: "Search" },
  { value: "Not Sure Yet", label: "Not Sure Yet", icon: "MessageSquare" },
];

const NOT_SELECTED = "Not selected";

export function QuoteForm({ defaultPackage }: { defaultPackage?: string }) {
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      features: [],
      packageChoice: (QUOTE_PACKAGES as readonly string[]).includes(defaultPackage ?? "")
        ? (defaultPackage as QuoteInput["packageChoice"])
        : undefined,
    },
  });

  const values = watch();
  const description = values.description ?? "";
  const features = values.features ?? [];

  async function onSubmit(data: QuoteInput) {
    setOutcome(null);
    // Files are held client-side only — nothing is uploaded until a storage
    // provider is configured, so we send filenames as context, not contents.
    const result = await submitForm("/api/quote", {
      ...data,
      attachments: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    });
    setOutcome(result);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card p-5 sm:p-6">
        {/* Contact ---------------------------------------------------------- */}
        <h2 className="font-display text-lg font-semibold text-ink">Contact Information</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Name" required autoComplete="name" placeholder="Your full name" error={errors.name?.message} {...register("name")} />
          <FormField label="Email" type="email" required autoComplete="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
          <FormField label="Phone number" type="tel" required autoComplete="tel" placeholder="Best number to reach you" error={errors.phone?.message} {...register("phone")} />
          <FormField label="Company" autoComplete="organization" placeholder="Your company name" error={errors.company?.message} {...register("company")} />
          <FormField label="Current website (optional)" type="url" placeholder="https://yourwebsite.com" wrapperClassName="sm:col-span-2" error={errors.currentWebsite?.message} {...register("currentWebsite")} />
        </div>

        {/* Project details -------------------------------------------------- */}
        <h2 className="mt-9 font-display text-lg font-semibold text-ink">Project Details</h2>
        <div className="mt-5 space-y-4">
          <RadioCardGroup
            legend="Service needed"
            name="quote-service"
            options={SERVICE_OPTIONS}
            value={values.service ?? ""}
            onChange={(v) => setValue("service", v as QuoteInput["service"], { shouldValidate: true })}
            error={errors.service?.message}
            required
            columns={3}
          />
          <input type="hidden" {...register("service")} />

          <SelectField
            label="Selected package"
            required
            placeholder="Select a package"
            options={QUOTE_PACKAGES}
            wrapperClassName="sm:max-w-md"
            error={errors.packageChoice?.message}
            {...register("packageChoice")}
          />

          <TextareaField
            label="Project description"
            required
            rows={6}
            maxLength={1500}
            currentLength={description.length}
            placeholder="Describe what you want to build, improve or achieve."
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        {/* Requirements ----------------------------------------------------- */}
        <h2 className="mt-9 font-display text-lg font-semibold text-ink">Project Requirements</h2>
        <div className="mt-5 space-y-5">
          <SelectField
            label="Number of website pages"
            placeholder="Select number of pages"
            options={QUOTE_PAGE_COUNTS}
            wrapperClassName="sm:max-w-md"
            error={errors.pages?.message}
            {...register("pages")}
          />

          <CheckboxGroup
            label="Required features (select all that apply)"
            options={QUOTE_FEATURES}
            value={features}
            onChange={(next) => setValue("features", next as QuoteInput["features"])}
            columns={4}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Budget range"
              required
              placeholder="Select your budget"
              options={QUOTE_BUDGETS}
              error={errors.budget?.message}
              {...register("budget")}
            />
            <FormField
              label="Desired completion date"
              type="date"
              error={errors.completionDate?.message}
              {...register("completionDate")}
            />
          </div>

          <FileUpload files={files} onChange={setFiles} disabled={isSubmitting} />
          <p className="flex items-start gap-2 text-xs text-muted">
            <Icon name="Lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Attachments stay private. They are never published, and are only used to review your
            request.
          </p>
        </div>

        <HoneypotField {...register("company_website")} />

        <div className="mt-7 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs text-muted">
            <Icon name="Lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Your information will only be used to review and respond to your quote request.
          </p>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            loadingLabel="Submitting…"
            className="shrink-0"
          >
            Submit Quote Request
          </Button>
        </div>

        <div className="mt-4 empty:mt-0">
          <FormOutcome
            outcome={outcome}
            successTitle="Request received"
            successBody="We've got your request and will review it. We'll follow up by email with questions or a proposal."
            fallbackAction={
              <ButtonLink href="/book" variant="outline" size="sm">
                Book a consultation instead
              </ButtonLink>
            }
          />
        </div>

        {files.length > 0 && outcome?.status === "not_configured" && (
          <div className="mt-3">
            <ErrorState
              variant="config"
              description={`Your ${files.length === 1 ? "attachment was" : "attachments were"} not uploaded, because file storage isn't connected yet. Please send them by email once we're in touch.`}
            />
          </div>
        )}
      </form>

      {/* Live summary ------------------------------------------------------- */}
      <div className="space-y-5">
        <div className="card h-fit p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-ink">Your Request</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {[
              ["Service", values.service],
              ["Package", values.packageChoice],
              ["Budget Range", values.budget],
              ["Timeline", values.completionDate],
              ["Pages", values.pages],
              ["Features", features.length ? `${features.length} selected` : ""],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <dt className="text-slate">{label}</dt>
                <dd className={value ? "text-right font-medium text-ink" : "text-right text-muted"}>
                  {value || NOT_SELECTED}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 border-t border-line-subtle pt-4">
            <p className="text-sm text-slate">Project Description</p>
            <p className="mt-1 text-sm text-muted">
              {description ? `${description.slice(0, 90)}${description.length > 90 ? "…" : ""}` : "Not provided yet"}
            </p>
          </div>
          {files.length > 0 && (
            <div className="mt-4 border-t border-line-subtle pt-4">
              <p className="text-sm text-slate">Attachments</p>
              <p className="mt-1 text-sm font-medium text-ink">{files.length} file{files.length === 1 ? "" : "s"}</p>
            </div>
          )}
        </div>

        <div className="card h-fit bg-tint p-5 sm:p-6">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper text-cobalt">
            <Icon name="HelpCircle" className="h-5 w-5" />
          </span>
          <h2 className="mt-3 font-display text-base font-semibold text-ink">
            Not Sure What to Choose?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            That&apos;s fine. We can help you define the right solution for your goals and budget.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            Book a free consultation and we&apos;ll guide you through the options.
          </p>
          <ButtonLink href="/book" variant="outline" size="sm" className="mt-4 w-full">
            Book a Consultation
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
