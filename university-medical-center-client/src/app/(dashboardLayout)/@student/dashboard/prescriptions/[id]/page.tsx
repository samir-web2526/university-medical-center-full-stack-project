import { getPrescriptionById } from '@/services';
import StudentPrescriptionDetailsPage from '@/components/pages/dashboardPages/studentDashboardPages/StudentPrescriptionDetailsPage';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function PrescriptionDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPrescriptionById(id);

  if (!result.data) {
    return notFound();
  }

  return <StudentPrescriptionDetailsPage prescription={result.data} />;
}
