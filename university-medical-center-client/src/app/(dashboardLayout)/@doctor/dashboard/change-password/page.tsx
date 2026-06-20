import type { Metadata } from "next";
import ChangePasswordPage from '@/components/pages/dashboardPages/ChangePasswordPage'

export const metadata: Metadata = {
  title: "Change Password | UMC, JSTU",
};

export default function DoctorChangePassword() {
  return (
    <div>
      <ChangePasswordPage />
    </div>
  )
}
