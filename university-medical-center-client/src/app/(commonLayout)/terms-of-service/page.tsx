import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | UMC, JSTU",
  description:
    "Terms of Service for UMC, JSTU Staff & Faculty Portal.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: June 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using the UMC, JSTU Staff &amp;
            Faculty Portal (&quot;Service&quot;), you agree to be bound by these Terms of
            Service. If you do not agree to any part of these terms, you must not
            use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
          <p className="text-muted-foreground">
            The Service is available exclusively to authorized staff and faculty
            members of JSTU Campus. By using the Service, you confirm that you are
            currently affiliated with the university and possess valid credentials
            for access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Account Responsibilities</h2>
          <div className="text-muted-foreground space-y-2">
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Maintaining the confidentiality of your login credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Notifying us immediately of any unauthorized use of your account.</li>
              <li>Ensuring that your profile information is accurate and up to date.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
          <div className="text-muted-foreground space-y-2">
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service for any unlawful or unauthorized purpose.</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its related systems.</li>
              <li>Interfere with or disrupt the Service, servers, or networks.</li>
              <li>Share your account credentials with any unauthorized person.</li>
              <li>Upload or transmit any harmful, malicious, or inappropriate content.</li>
              <li>Use the Service to impersonate another person or entity.</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Medical Services</h2>
          <p className="text-muted-foreground">
            The Service facilitates appointment scheduling, prescription management,
            and communication with medical professionals. The Service does not
            replace professional medical advice, diagnosis, or treatment. Always
            seek the advice of a qualified healthcare provider with any questions
            regarding a medical condition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content, design, graphics, and other materials on the Service are
            the intellectual property of UMC or its licensors. You may not copy,
            reproduce, distribute, or create derivative works from any content on
            the Service without prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Privacy</h2>
          <p className="text-muted-foreground">
            Your use of the Service is also governed by our Privacy Policy, which
            describes how we collect, use, and protect your personal information.
            By using the Service, you consent to the practices described in the
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground">
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis
            without warranties of any kind, whether express or implied. UMC does
            not warrant that the Service will be uninterrupted, error-free, or
            completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, UMC shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages
            arising out of your use of or inability to use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
          <p className="text-muted-foreground">
            We may suspend or terminate your access to the Service at any time,
            without prior notice, for conduct that we determine violates these
            Terms or is harmful to other users, us, or third parties, or for any
            other reason at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms of Service at any time.
            Changes will be effective immediately upon posting. Your continued use
            of the Service after changes are posted constitutes acceptance of the
            revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms shall be governed by and construed in accordance with the
            laws of Bangladesh. Any disputes arising under these Terms shall be
            subject to the exclusive jurisdiction of the courts of Bangladesh.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Email: support@umc.edu.bd</li>
            <li>Phone: +880 9612 345 678</li>
            <li>Address: JSTU Campus, Melandah, Jamalpur-2000</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
