import type { Metadata } from "next";
import DoctorMedicinesListPage from '@/components/pages/dashboardPages/DoctorDashboardPages/DoctorMedicinesListPage';

export const metadata: Metadata = {
  title: "Medicines | UMC, JSTU",
};

export default function Page() {
  return <DoctorMedicinesListPage />;
}
