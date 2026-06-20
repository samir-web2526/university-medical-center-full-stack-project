import type { Metadata } from "next";
import DoctorDetailsPage from '@/components/pages/dashboardPages/AdminDashboardPages/DoctorDetailsPage';
import { getDoctorById} from '@/services';

import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Doctor Details | UMC, JSTU",
  };
}

export default async function DoctorDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getDoctorById(id);

  if (!result.data) {
    return notFound();
  }

  return (
    <div>
      <DoctorDetailsPage doctor={result.data} />
    </div>
  );
}
