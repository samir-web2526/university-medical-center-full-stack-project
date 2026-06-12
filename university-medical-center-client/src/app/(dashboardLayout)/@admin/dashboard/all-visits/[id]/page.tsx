import VisitDetailsPage from '@/components/pages/dashboardPages/AdminDashboardPages/VisitDetailsPage';
import { getVisitById } from '@/services';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VisitDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getVisitById(id);

  if (!result.data) {
    return notFound();
  }

  return (
    <div>
      <VisitDetailsPage visit={result.data} />
    </div>
  );
}
