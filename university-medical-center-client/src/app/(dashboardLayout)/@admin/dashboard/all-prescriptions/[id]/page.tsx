import PrescriptionDetailsPage from '@/components/pages/dashboardPages/AdminDashboardPages/PrescriptionDetailsPage';
import { getPrescriptionById } from '@/services/prescription.service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PrescriptionDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPrescriptionById(id);

  if (!result.data) {
    return notFound();
  }

  return (
    <div>
      <PrescriptionDetailsPage prescription={result.data} />
    </div>
  );
}
