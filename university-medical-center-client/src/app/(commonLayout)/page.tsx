import type { Metadata } from "next";
import HeroSection from "@/components/pages/homeSections/HeroSection";
import ServicesSection from "@/components/pages/homeSections/ServicesSection";
import HowItWorksSection from "@/components/pages/homeSections/HowItWorksSection";
import BlogPreviewSection from "@/components/pages/homeSections/BlogPreviewSection";
import ContactSection from "@/components/pages/homeSections/ContactSection";
import { getPublicDoctors } from "@/services/doctor.service";
import { getVisits } from "@/services/visit.service";

export const metadata: Metadata = {
  title: "Home | UMC, JSTU",
  description:
    "UMC, JSTU - Access healthcare services, appointments, prescriptions, and more for JSTU staff and faculty.",
};

export default async function UniversityMedicalCenterHome() {
  const [doctorsRes, visitsRes] = await Promise.all([
    getPublicDoctors(1, 1),
    getVisits(1, 1),
  ]);

  const doctorCount = doctorsRes.data?.meta?.total ?? 0;
  const visitCount = visitsRes.data?.meta?.total ?? 0;

  return (
    <>
      <HeroSection doctorCount={doctorCount} visitCount={visitCount} />
      <ServicesSection />
      <HowItWorksSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
