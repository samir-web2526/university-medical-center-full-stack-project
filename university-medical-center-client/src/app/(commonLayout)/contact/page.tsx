import type { Metadata } from "next";
import ContactPage from "@/components/pages/NavbarPages/ContactPage";

export const metadata: Metadata = {
  title: "Contact | UMC, JSTU",
  description:
    "Get in touch with UMC, JSTU - phone, email, and location details.",
};

export default function Contact() {
  return <ContactPage />;
}
