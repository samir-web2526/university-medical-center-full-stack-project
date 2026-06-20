import Footer from "@/components/pages/sharedPages/Footer";
import { Navbar } from "@/components/pages/sharedPages/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/auth";
import { getMyProfile as getStudentProfile } from "@/services/student.service";
import { getMyProfile as getDoctorProfile } from "@/services/doctor.service";

import React from "react";



export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  let imageUrl: string | null = null;
  if (user) {
    if (user.role === "STUDENT") {
      const { data } = await getStudentProfile();
      imageUrl = data?.imageUrl ?? null;
    } else if (user.role === "DOCTOR") {
      const { data } = await getDoctorProfile();
      imageUrl = data?.imageUrl ?? null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={
          user ? { name: user.name, email: user.email, role: user.role, image: imageUrl } : null
        }
      />
      <main className="flex-1 w-full">
        <TooltipProvider>{children}</TooltipProvider>
      </main>
      <Footer />
    </div>
  );
}
