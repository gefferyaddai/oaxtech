"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormOutcome, submitForm } from "@/components/forms/FormStatus";
import { FormField, HoneypotField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/schemas";
import type { SubmissionOutcome } from "@/lib/integrations";

/**
 * Validates the address properly, but never claims a subscription was saved —
 * the server decides, and says so when no mailing list is connected.
 */
export function NewsletterForm() {
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(values: NewsletterInput) {
    setOutcome(null);
    const result = await submitForm("/api/newsletter", values);
    setOutcome(result);
    // Both outcomes mean the submission reached us, so clear the form.
    if (result.status === "delivered" || result.status === "received") reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <FormField
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          wrapperClassName="flex-1"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          loadingLabel="Subscribing…"
          className="sm:mt-[1.6875rem]"
        >
          Subscribe
        </Button>
      </div>

      <HoneypotField {...register("company_website")} />

      <div className="mt-3 empty:mt-0">
        <FormOutcome
          outcome={outcome}
          successTitle="You're subscribed"
          successBody="We'll email you when new guides go up."
        />
      </div>
    </form>
  );
}
