"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormOutcome, submitForm } from "@/components/forms/FormStatus";
import {
  FormField,
  HoneypotField,
  SelectField,
  TextareaField,
} from "@/components/forms/Fields";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_SUBJECTS, contactSchema, type ContactInput } from "@/lib/validation/schemas";
import type { SubmissionOutcome } from "@/lib/integrations";

const MESSAGE_MAX = 1500;

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: (CONTACT_SUBJECTS as readonly string[]).includes(defaultSubject ?? "")
        ? (defaultSubject as ContactInput["subject"])
        : undefined,
    },
  });

  const message = watch("message") ?? "";

  async function onSubmit(values: ContactInput) {
    setOutcome(null);
    const result = await submitForm("/api/contact", values);
    setOutcome(result);
    // Both outcomes mean the submission reached us, so clear the form.
    if (result.status === "delivered" || result.status === "received") reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Send Us a Message</h2>

      <div className="mt-6 space-y-4">
        <FormField
          label="Name"
          required
          autoComplete="name"
          placeholder="Your full name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="Include a number if you'd prefer a call"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <SelectField
          label="Subject"
          required
          placeholder="Select a subject"
          options={CONTACT_SUBJECTS}
          error={errors.subject?.message}
          {...register("subject")}
        />
        <TextareaField
          label="Message"
          required
          rows={6}
          maxLength={MESSAGE_MAX}
          currentLength={message.length}
          placeholder="Tell us about your project or how we can help."
          error={errors.message?.message}
          {...register("message")}
        />

        <HoneypotField {...register("company_website")} />
      </div>

      <div className="mt-5">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          loadingLabel="Sending…"
        >
          Send Message
        </Button>
      </div>

      <p className="mt-3 flex items-start gap-2 text-xs text-muted">
        <Icon name="Lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Your details are secure and will only be used to respond to your message.
      </p>

      <div className="mt-4 empty:mt-0">
        <FormOutcome
          outcome={outcome}
          successTitle="Message sent"
          successBody="Thanks — we've received your message and will get back to you."
          fallbackAction={
            <ButtonLink href="/book" variant="outline" size="sm">
              Book a consultation instead
            </ButtonLink>
          }
        />
      </div>
    </form>
  );
}
