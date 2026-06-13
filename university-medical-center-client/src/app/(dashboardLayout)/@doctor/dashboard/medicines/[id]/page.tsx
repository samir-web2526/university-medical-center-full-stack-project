import { getMedicineById} from "@/services";
import { notFound } from "next/navigation";
import MedicineDetailsPage from "@/components/pages/dashboardPages/AdminDashboardPages/MedicineDetailsPage";

export const dynamic = "force-dynamic";

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

  return <MedicineDetailsPage medicine={result.data} />;
}
