import type { Metadata } from "next";
import StudentDetailsPage from '@/components/pages/dashboardPages/AdminDashboardPages/StudentDetailsPage';
import { getStudentById } from '@/services/student.service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Student Details | UMC, JSTU",
  };
}

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