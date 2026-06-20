import type { Metadata } from "next";
import { getMedicineById} from "@/services";
import { notFound } from "next/navigation";
import DoctorMedicineDetailsPage from "@/components/pages/dashboardPages/DoctorDashboardPages/DoctorMedicineDetailsPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Medicine Details | UMC, JSTU",
  };
}

export default async function MedicineDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getMedicineById(id);
  if (!result.data) {
    return notFound();
  }

  return <DoctorMedicineDetailsPage medicine={result.data} />;
}
