import { z } from "zod";

/**
 * ONE shared validation system.
 *
 * These schemas are imported by the client (react-hook-form + zodResolver) and
 * by the API routes. A payload that fails here is rejected server-side even if
 * the browser was bypassed entirely.
 */

/* --- Reusable primitives --------------------------------------------------- */

const name = z
  .string()
  .trim()
  .min(2, "Enter your name (at least 2 characters).")
  .max(80, "Name must be 80 characters or fewer.");

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address, like you@company.com.")
  .max(160, "Email must be 160 characters or fewer.");

const phoneRequired = z
  .string()
  .trim()
  .min(7, "Enter a phone number we can reach you on.")
  .max(30, "Phone number must be 30 characters or fewer.")
  .regex(/^[\d\s()+.-]+$/, "Use digits, spaces and ( ) + - . only.");

const phoneOptional = z
  .string()
  .trim()
  .max(30, "Phone number must be 30 characters or fewer.")
  .regex(/^[\d\s()+.-]*$/, "Use digits, spaces and ( ) + - . only.")
  .optional()
  .or(z.literal(""));

const websiteOptional = z
  .string()
  .trim()
  .max(200)
  .refine(
    (v) => v === "" || /^https?:\/\/.+\..+/.test(v),
    "Include the full address, starting with https://",
  )
  .optional()
  .or(z.literal(""));

const company = z.string().trim().max(120, "Company name must be 120 characters or fewer.");

/** Honeypot: a hidden field real people never fill in. */
const honeypot = z.literal("").optional();

/* --- Contact --------------------------------------------------------------- */

export const CONTACT_SUBJECTS = [
  "New project enquiry",
  "Website design and development",
  "Custom software",
  "Marketing consulting",
  "SEO",
  "Partnership or community project",
  "Something else",
] as const;

export const contactSchema = z.object({
  name,
  email,
  phone: phoneOptional,
  subject: z.enum(CONTACT_SUBJECTS, {
    errorMap: () => ({ message: "Choose a subject so we can route your message." }),
  }),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least 20 characters.")
    .max(1500, "Message must be 1500 characters or fewer."),
  company_website: honeypot,
  spamToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/* --- Quote ----------------------------------------------------------------- */

export const QUOTE_SERVICES = [
  "Website Development",
  "Custom Software",
  "Marketing Consulting",
  "SEO",
  "Not Sure Yet",
] as const;

export const QUOTE_PACKAGES = [
  "One-Page Website",
  "Business Website",
  "Advanced Website",
  "Custom software — request a quote",
  "SEO — request pricing",
  "Marketing — request pricing",
  "Not sure yet",
] as const;

export const QUOTE_PAGE_COUNTS = ["1", "2–5", "6–10", "More than 10", "Not sure yet"] as const;

export const QUOTE_FEATURES = [
  "Contact Forms",
  "Online Payments",
  "User Accounts",
  "Admin Dashboard",
  "API Integrations",
  "Booking System",
  "E-commerce",
  "SEO",
  "Other",
] as const;

export const QUOTE_BUDGETS = [
  "Under $1,000 CAD",
  "$1,000 – $2,500 CAD",
  "$2,500 – $5,000 CAD",
  "$5,000 – $10,000 CAD",
  "More than $10,000 CAD",
  "Not sure yet",
] as const;

export const quoteSchema = z.object({
  name,
  email,
  phone: phoneRequired,
  company: company.optional().or(z.literal("")),
  currentWebsite: websiteOptional,
  service: z.enum(QUOTE_SERVICES, {
    errorMap: () => ({ message: "Choose the service you need." }),
  }),
  packageChoice: z.enum(QUOTE_PACKAGES, {
    errorMap: () => ({ message: "Choose a package, or select “Not sure yet”." }),
  }),
  description: z
    .string()
    .trim()
    .min(30, "Describe your project in at least 30 characters.")
    .max(1500, "Description must be 1500 characters or fewer."),
  pages: z.enum(QUOTE_PAGE_COUNTS).optional().or(z.literal("")),
  features: z.array(z.enum(QUOTE_FEATURES)).default([]),
  budget: z.enum(QUOTE_BUDGETS, {
    errorMap: () => ({ message: "Choose a budget range, or select “Not sure yet”." }),
  }),
  completionDate: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || !Number.isNaN(Date.parse(v)),
      "Enter a valid date.",
    )
    .optional()
    .or(z.literal("")),
  company_website: honeypot,
  spamToken: z.string().optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

/* --- File upload constraints (shared client + server) ---------------------- */

export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024; // 10MB, matching the mockup
export const UPLOAD_MAX_FILES = 5;
export const UPLOAD_ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "application/zip",
  "application/x-zip-compressed",
] as const;
export const UPLOAD_ACCEPTED_LABEL = "PDF, DOC, DOCX, PNG, JPG, ZIP up to 10MB each";

export function validateUploadFile(file: { name: string; size: number; type: string }): string | null {
  const okType =
    (UPLOAD_ACCEPTED_TYPES as readonly string[]).includes(file.type) ||
    /\.(pdf|docx?|png|jpe?g|zip)$/i.test(file.name);
  if (!okType) return `${file.name}: file type not accepted. ${UPLOAD_ACCEPTED_LABEL}.`;
  if (file.size > UPLOAD_MAX_BYTES) return `${file.name}: file is larger than 10MB.`;
  if (file.size === 0) return `${file.name}: file is empty.`;
  return null;
}

/* --- Booking --------------------------------------------------------------- */

export const BOOKING_SERVICES = [
  "Website Development",
  "Custom Software",
  "Marketing Consulting",
  "SEO",
  "General Consultation",
] as const;

export const BOOKING_BUDGETS = [
  "Under $1,000 CAD",
  "$1,000 – $2,500 CAD",
  "$2,500 – $5,000 CAD",
  "$5,000 – $10,000 CAD",
  "More than $10,000 CAD",
  "Prefer to discuss",
] as const;

export const bookingSchema = z.object({
  service: z.enum(BOOKING_SERVICES, {
    errorMap: () => ({ message: "Choose the service you'd like to talk about." }),
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time."),
  timeZone: z.string().min(1, "Time zone could not be detected."),
  name,
  email,
  phone: phoneRequired,
  companyName: company.min(1, "Enter your company name."),
  currentWebsite: websiteOptional,
  budget: z.enum(BOOKING_BUDGETS).optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(20, "Tell us what you're looking to build — at least 20 characters.")
    .max(1000, "Description must be 1000 characters or fewer."),
  company_website: honeypot,
  spamToken: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/* --- Newsletter ------------------------------------------------------------ */

export const newsletterSchema = z.object({
  email,
  company_website: honeypot,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/* --- Portal demo sign-in --------------------------------------------------- */

export const portalLoginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean().default(false),
});

export type PortalLoginInput = z.infer<typeof portalLoginSchema>;

/* --- Shared server-side helper --------------------------------------------- */

export function flattenFieldErrors(error: z.ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
