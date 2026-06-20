import type { Metadata } from "next";
import HeroSection from "@/components/pages/homeSections/HeroSection";
import ServicesSection from "@/components/pages/homeSections/ServicesSection";
import HowItWorksSection from "@/components/pages/homeSections/HowItWorksSection";
import BlogPreviewSection from "@/components/pages/homeSections/BlogPreviewSection";
import ContactSection from "@/components/pages/homeSections/ContactSection";

export const metadata: Metadata = {
  title: "Home | UMC, JSTU",
  description:
    "UMC, JSTU - Access healthcare services, appointments, prescriptions, and more for JSTU staff and faculty.",
};

export default function UniversityMedicalCenterHome() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
