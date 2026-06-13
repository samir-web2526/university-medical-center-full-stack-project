import { getVisitById } from '@/services';
import StudentVisitDetailsPage from '@/components/pages/dashboardPages/studentDashboardPages/StudentVisitDetailsPage';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function VisitDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getVisitById(id);

  if (!result.data) {
    return notFound();
  }

  return <StudentVisitDetailsPage visit={result.data} />;
}
