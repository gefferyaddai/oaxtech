import type { Metadata } from "next";
import { ApprovalsView } from "@/components/admin/section-views";
import { getApprovals, getProjects } from "@/lib/admin/repository";

export const metadata: Metadata = { title: "Approvals" };

export default async function ApprovalsPage() {
  const [approvals, projects] = await Promise.all([getApprovals(), getProjects()]);
  return <ApprovalsView approvals={approvals} projects={projects} />;
}
