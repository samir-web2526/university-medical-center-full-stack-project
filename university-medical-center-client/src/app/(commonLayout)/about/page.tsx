import type { Metadata } from "next";
import AboutPage from "@/components/pages/NavbarPages/AboutPage";
import { getPublicDoctors } from "@/services/doctor.service";
import { getVisits } from "@/services/visit.service";

export const metadata: Metadata = {
  title: "About | UMC, JSTU",
  description:
    "Learn about UMC, JSTU - our mission, vision, and commitment to healthcare for JSTU staff and faculty.",
};

export default async function About() {
  const [doctorsRes, visitsRes] = await Promise.all([
    getPublicDoctors(1, 1),
    getVisits(1, 1),
  ]);

  const doctorCount = doctorsRes.data?.meta?.total ?? 0;
  const visitCount = visitsRes.data?.meta?.total ?? 0;

  return <AboutPage doctorCount={doctorCount} visitCount={visitCount} />;
}
