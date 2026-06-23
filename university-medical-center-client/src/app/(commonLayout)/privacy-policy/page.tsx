import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | UMC, JSTU",
  description:
    "Privacy Policy for UMC, JSTU Staff & Faculty Portal.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .policy-fade { animation: fadeUp 0.5s ease-out both; }
        .policy-fade-d1 { animation-delay: 0.05s; }
        .policy-fade-d2 { animation-delay: 0.1s; }
        .policy-fade-d3 { animation-delay: 0.15s; }
        .policy-fade-d4 { animation-delay: 0.2s; }
        .policy-fade-d5 { animation-delay: 0.25s; }
        .policy-fade-d6 { animation-delay: 0.3s; }
        .policy-fade-d7 { animation-delay: 0.35s; }
        .policy-fade-d8 { animation-delay: 0.4s; }
        .policy-fade-d9 { animation-delay: 0.45s; }
        .policy-fade-d10 { animation-delay: 0.5s; }
        .section-card {
          border-left: 3px solid transparent;
          transition: box-shadow 0.3s ease, border-left-color 0.3s ease;
        }
        .section-card:hover {
          animation: cardFloat 2s ease-in-out infinite;
          border-left-color: #0b5394;
          box-shadow: 0 4px 20px rgba(11, 83, 148, 0.1);
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0b5394] via-[#0e7490] to-[#2196f3] py-16 px-6">
        <div className="max-w-4xl mx-auto policy-fade">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/70 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6 text-sm leading-relaxed">

          <div className="section-card policy-fade policy-fade-d1 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">1</span>
              Introduction
            </h2>
            <p className="text-muted-foreground">
              UMC, JSTU (&quot;UMC&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Staff &amp; Faculty Portal
              (&quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our Service. By accessing or
              using the Service, you agree to the collection and use of information in
              accordance with this policy.
            </p>
          </div>

          <div className="section-card policy-fade policy-fade-d2 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">2</span>
              Information We Collect
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>We may collect the following types of information:</p>
              <ul className="list-none pl-0 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  <span><strong>Personal Information:</strong> Name, email address, phone number, employee/student ID, role designation, and other identifying information you provide during registration or profile updates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  <span><strong>Medical Records:</strong> Health-related information submitted through the portal for appointment scheduling, prescriptions, and medical consultations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  <span><strong>Usage Data:</strong> Automatically collected information such as IP address, browser type, pages visited, time spent on pages, and other diagnostic data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  <span><strong>Cookies:</strong> We use cookies and similar tracking technologies to maintain session state and improve your experience.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="section-card policy-fade policy-fade-d3 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">3</span>
              How We Use Your Information
            </h2>
            <ul className="list-none pl-0 text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                To provide, operate, and maintain the Service.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                To process appointments, prescriptions, and medical consultations.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                To manage your account and authenticate your identity.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                To communicate with you regarding service updates, health advisories, and support.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                To improve the Service through analytics and usage monitoring.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                To comply with legal obligations and protect against misuse.
              </li>
            </ul>
          </div>

          <div className="section-card policy-fade policy-fade-d4 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">4</span>
              Information Sharing
            </h2>
            <p className="text-muted-foreground">
              We do not sell or rent your personal information to third parties. We may
              share your information only in the following circumstances:
            </p>
            <ul className="list-none pl-0 text-muted-foreground space-y-2 mt-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                With authorized medical staff directly involved in your care.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                With university administration as required for institutional compliance.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                When required by law, regulation, or legal process.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                To protect the rights, property, or safety of UMC, our users, or the public.
              </li>
            </ul>
          </div>

          <div className="section-card policy-fade policy-fade-d5 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">5</span>
              Data Security
            </h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational security measures to
              protect your personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission over the
              Internet or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </div>

          <div className="section-card policy-fade policy-fade-d6 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">6</span>
              Data Retention
            </h2>
            <p className="text-muted-foreground">
              We retain your personal information only for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a longer
              retention period is required or permitted by law. Medical records may be
              retained for longer periods in accordance with applicable healthcare
              regulations.
            </p>
          </div>

          <div className="section-card policy-fade policy-fade-d7 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">7</span>
              Your Rights
            </h2>
            <p className="text-muted-foreground mb-3">You have the right to:</p>
            <ul className="list-none pl-0 text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                Access the personal information we hold about you.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                Request correction of inaccurate or incomplete data.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                Request deletion of your personal data, subject to legal obligations.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                Object to or restrict the processing of your data.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                Withdraw consent at any time where we rely on consent for processing.
              </li>
            </ul>
          </div>

          <div className="section-card policy-fade policy-fade-d8 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">8</span>
              Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground">
              Our Service is intended for use by university staff and faculty members.
              We do not knowingly collect personal information from children under the
              age of 18. If we become aware that we have collected such information,
              we will take steps to delete it promptly.
            </p>
          </div>

          <div className="section-card policy-fade policy-fade-d9 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">9</span>
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you
              of any changes by posting the new Privacy Policy on this page and
              updating the &quot;Last updated&quot; date. You are advised to review this
              Privacy Policy periodically for any changes.
            </p>
          </div>

          <div className="section-card policy-fade policy-fade-d10 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">10</span>
              Contact Us
            </h2>
            <p className="text-muted-foreground mb-3">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none pl-0 text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] shrink-0" />
                Email: support@umc.edu.bd
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] shrink-0" />
                Phone: +880 9612 345 678
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] shrink-0" />
                Address: JSTU Campus, Melandah, Jamalpur-2000
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
