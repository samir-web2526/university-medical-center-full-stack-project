import type { Metadata } from "next";
import RegisterPageClient from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Register | UMC, JSTU",
  description:
    "Create a new account at UMC, JSTU to access healthcare services.",
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
