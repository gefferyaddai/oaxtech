import type { Metadata } from "next";
import { MessagesView } from "@/components/admin/section-views";
import { getClients, getMessages } from "@/lib/admin/repository";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const [messages, clients] = await Promise.all([getMessages(), getClients()]);
  return <MessagesView messages={messages} clients={clients} />;
}
