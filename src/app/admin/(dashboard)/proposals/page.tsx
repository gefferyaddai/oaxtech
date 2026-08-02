import type { Metadata } from "next";
import { ProposalsView } from "@/components/admin/section-views";
import { getClients, getProposals } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Proposals" };

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const [{ create }, proposals, clients] = await Promise.all([
    searchParams,
    getProposals(),
    getClients(),
  ]);
  return <ProposalsView proposals={proposals} clients={clients} autoOpenCreate={create === "proposal"} />;
}
