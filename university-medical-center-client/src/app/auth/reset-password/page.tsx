import type { Metadata } from "next";
import ResetPasswordPageClient from "./ResetPasswordPageClient";

export const metadata: Metadata = {
  title: "Reset Password | UMC, JSTU",
  description:
    "Set a new password for your UMC, JSTU account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
