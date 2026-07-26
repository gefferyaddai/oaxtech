import { handleSubmission } from "@/lib/api-handler";
import { contactSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  return handleSubmission(request, {
    schema: contactSchema,
    kind: "contact",
    subject: (d) => `Contact form: ${d.subject}`,
    replyTo: (d) => d.email,
    body: (d) =>
      [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        d.phone ? `Phone: ${d.phone}` : null,
        `Subject: ${d.subject}`,
        "",
        d.message,
      ]
        .filter(Boolean)
        .join("\n"),
  });
}
