import type { Metadata } from "next";
import ForgotPasswordPageClient from "./ForgotPasswordPageClient";

export const metadata: Metadata = {
  title: "Forgot Password | UMC, JSTU",
  description:
    "Reset your UMC, JSTU account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
