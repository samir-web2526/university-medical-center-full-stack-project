import type { Metadata } from "next";
import AboutPage from "@/components/pages/NavbarPages/AboutPage";

export const metadata: Metadata = {
  title: "About | UMC, JSTU",
  description:
    "Learn about UMC, JSTU - our mission, vision, and commitment to healthcare for JSTU staff and faculty.",
};

export default function About() {
  return <AboutPage />;
}
