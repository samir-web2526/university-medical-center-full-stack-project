import type { Metadata } from "next";
import MedicineDetailsPage from '@/components/pages/dashboardPages/AdminDashboardPages/MedicineDetailsPage';
import { getMedicineById } from '@/services';

import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

  return (
    <div>
      <MedicineDetailsPage medicine={result.data} />
    </div>
  );
}
