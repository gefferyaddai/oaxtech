import { handleSubmission } from "@/lib/api-handler";
import { quoteSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  return handleSubmission(request, {
    schema: quoteSchema,
    kind: "quote",
    subject: (d) => `Quote request: ${d.service} — ${d.name}`,
    replyTo: (d) => d.email,
    body: (d) =>
      [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone}`,
        d.company ? `Company: ${d.company}` : null,
        d.currentWebsite ? `Current website: ${d.currentWebsite}` : null,
        `Service: ${d.service}`,
        `Package: ${d.packageChoice}`,
        d.pages ? `Pages: ${d.pages}` : null,
        d.features?.length ? `Features: ${d.features.join(", ")}` : null,
        `Budget: ${d.budget}`,
        d.completionDate ? `Desired completion: ${d.completionDate}` : null,
        "",
        d.description,
      ]
        .filter(Boolean)
        .join("\n"),
  });
}
