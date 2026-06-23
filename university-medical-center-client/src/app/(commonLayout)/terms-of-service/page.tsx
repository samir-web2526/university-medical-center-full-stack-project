import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | UMC, JSTU",
  description:
    "Terms of Service for UMC, JSTU Staff & Faculty Portal.",
};

export default function TermsOfServicePage() {
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
        .terms-fade { animation: fadeUp 0.5s ease-out both; }
        .terms-fade-d1 { animation-delay: 0.05s; }
        .terms-fade-d2 { animation-delay: 0.1s; }
        .terms-fade-d3 { animation-delay: 0.15s; }
        .terms-fade-d4 { animation-delay: 0.2s; }
        .terms-fade-d5 { animation-delay: 0.25s; }
        .terms-fade-d6 { animation-delay: 0.3s; }
        .terms-fade-d7 { animation-delay: 0.35s; }
        .terms-fade-d8 { animation-delay: 0.4s; }
        .terms-fade-d9 { animation-delay: 0.45s; }
        .terms-fade-d10 { animation-delay: 0.5s; }
        .terms-fade-d11 { animation-delay: 0.55s; }
        .terms-fade-d12 { animation-delay: 0.6s; }
        .terms-fade-d13 { animation-delay: 0.65s; }
        .section-card {
          border-left: 3px solid transparent;
          transition: box-shadow 0.3s ease, border-left-color 0.3s ease;
        }
        .section-card:hover {
          animation: cardFloat 2s ease-in-out infinite;
          border-left-color: #0b5394;
          box-shadow: 0 4px 20px rgba(11, 83, 148, 0.1);
        }
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0b5394] via-[#0e7490] to-[#2196f3] py-16 px-6">
        <div className="max-w-4xl mx-auto terms-fade">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-white/70 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6 text-sm leading-relaxed">

          <div className="section-card terms-fade terms-fade-d1 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing and using the UMC, JSTU Staff &amp;
              Faculty Portal (&quot;Service&quot;), you agree to be bound by these Terms of
              Service. If you do not agree to any part of these terms, you must not
              use the Service.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d2 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">2</span>
              Eligibility
            </h2>
            <p className="text-muted-foreground">
              The Service is available exclusively to authorized staff and faculty
              members of JSTU Campus. By using the Service, you confirm that you are
              currently affiliated with the university and possess valid credentials
              for access.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d3 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">3</span>
              Account Responsibilities
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>You are responsible for:</p>
              <ul className="list-none pl-0 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Maintaining the confidentiality of your login credentials.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  All activities that occur under your account.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Notifying us immediately of any unauthorized use of your account.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Ensuring that your profile information is accurate and up to date.
                </li>
              </ul>
            </div>
          </div>

          <div className="section-card terms-fade terms-fade-d4 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">4</span>
              Acceptable Use
            </h2>
            <div className="text-muted-foreground space-y-2">
              <p>You agree not to:</p>
              <ul className="list-none pl-0 space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Use the Service for any unlawful or unauthorized purpose.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Attempt to gain unauthorized access to any part of the Service or its related systems.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Interfere with or disrupt the Service, servers, or networks.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Share your account credentials with any unauthorized person.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Upload or transmit any harmful, malicious, or inappropriate content.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Use the Service to impersonate another person or entity.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b5394] dark:bg-[#60a5fa] mt-1.5 shrink-0" />
                  Reverse engineer, decompile, or disassemble any part of the Service.
                </li>
              </ul>
            </div>
          </div>

          <div className="section-card terms-fade terms-fade-d5 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">5</span>
              Medical Services
            </h2>
            <p className="text-muted-foreground">
              The Service facilitates appointment scheduling, prescription management,
              and communication with medical professionals. The Service does not
              replace professional medical advice, diagnosis, or treatment. Always
              seek the advice of a qualified healthcare provider with any questions
              regarding a medical condition.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d6 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">6</span>
              Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              All content, design, graphics, and other materials on the Service are
              the intellectual property of UMC or its licensors. You may not copy,
              reproduce, distribute, or create derivative works from any content on
              the Service without prior written permission.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d7 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">7</span>
              Privacy
            </h2>
            <p className="text-muted-foreground">
              Your use of the Service is also governed by our Privacy Policy, which
              describes how we collect, use, and protect your personal information.
              By using the Service, you consent to the practices described in the
              Privacy Policy.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d8 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">8</span>
              Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground">
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis
              without warranties of any kind, whether express or implied. UMC does
              not warrant that the Service will be uninterrupted, error-free, or
              completely secure.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d9 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">9</span>
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, UMC shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages
              arising out of your use of or inability to use the Service.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d10 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">10</span>
              Termination
            </h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your access to the Service at any time,
              without prior notice, for conduct that we determine violates these
              Terms or is harmful to other users, us, or third parties, or for any
              other reason at our sole discretion.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d11 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">11</span>
              Changes to Terms
            </h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms of Service at any time.
              Changes will be effective immediately upon posting. Your continued use
              of the Service after changes are posted constitutes acceptance of the
              revised terms.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d12 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">12</span>
              Governing Law
            </h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the
              laws of Bangladesh. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the courts of Bangladesh.
            </p>
          </div>

          <div className="section-card terms-fade terms-fade-d13 rounded-xl p-6 bg-card border border-border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 text-[#0b5394] dark:text-[#60a5fa] flex items-center justify-center text-xs font-bold">13</span>
              Contact Us
            </h2>
            <p className="text-muted-foreground mb-3">
              If you have any questions about these Terms of Service, please contact us:
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
