import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Login | UMC, JSTU",
  description:
    "Sign in to your UMC, JSTU account to access healthcare services.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
