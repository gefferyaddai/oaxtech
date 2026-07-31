import type { Metadata } from "next";
import { ConsultationsView } from "@/components/admin/section-views";
import { getConsultations } from "@/lib/admin/repository";

export const metadata: Metadata = { title: "Consultations" };

export default async function ConsultationsPage() {
  const consultations = await getConsultations();
  return <ConsultationsView consultations={consultations} />;
}
