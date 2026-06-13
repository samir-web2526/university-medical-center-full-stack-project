import { getMedicineById } from '@/services';
import MedicineDetailsPage from '@/components/pages/dashboardPages/AdminDashboardPages/MedicineDetailsPage';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getMedicineById(id);

  if (!result.data) {
    return notFound();
  }

  return <MedicineDetailsPage medicine={result.data} />;
}
