import StudentDetailsPage from '@/components/pages/dashboardPages/AdminDashboardPages/StudentDetailsPage';
import { getStudentById } from '@/services/student.service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function StudentDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getStudentById(id);

  if (!result.data) {
    return notFound();
  }

  return (
    <div>
      <StudentDetailsPage student={result.data} />
    </div>
  );
}