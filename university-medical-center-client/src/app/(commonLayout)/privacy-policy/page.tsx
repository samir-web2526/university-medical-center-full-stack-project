import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | UMC, JSTU",
  description:
    "Privacy Policy for UMC, JSTU Staff & Faculty Portal.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: June 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground">
            UMC, JSTU (&quot;UMC&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Staff &amp; Faculty Portal
            (&quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our Service. By accessing or
            using the Service, you agree to the collection and use of information in
            accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <div className="text-muted-foreground space-y-2">
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number,
                employee/student ID, role designation, and other identifying information
                you provide during registration or profile updates.
              </li>
              <li>
                <strong>Medical Records:</strong> Health-related information submitted
                through the portal for appointment scheduling, prescriptions, and
                medical consultations.
              </li>
              <li>
                <strong>Usage Data:</strong> Automatically collected information such as
                IP address, browser type, pages visited, time spent on pages, and other
                diagnostic data.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies and similar tracking technologies
                to maintain session state and improve your experience.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>To provide, operate, and maintain the Service.</li>
            <li>To process appointments, prescriptions, and medical consultations.</li>
            <li>To manage your account and authenticate your identity.</li>
            <li>To communicate with you regarding service updates, health advisories, and support.</li>
            <li>To improve the Service through analytics and usage monitoring.</li>
            <li>To comply with legal obligations and protect against misuse.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Information Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell or rent your personal information to third parties. We may
            share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>With authorized medical staff directly involved in your care.</li>
            <li>With university administration as required for institutional compliance.</li>
            <li>When required by law, regulation, or legal process.</li>
            <li>To protect the rights, property, or safety of UMC, our users, or the public.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational security measures to
            protect your personal information against unauthorized access, alteration,
            disclosure, or destruction. However, no method of transmission over the
            Internet or electronic storage is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a longer
            retention period is required or permitted by law. Medical records may be
            retained for longer periods in accordance with applicable healthcare
            regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>Request deletion of your personal data, subject to legal obligations.</li>
            <li>Object to or restrict the processing of your data.</li>
            <li>Withdraw consent at any time where we rely on consent for processing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground">
            Our Service is intended for use by university staff and faculty members.
            We do not knowingly collect personal information from children under the
            age of 18. If we become aware that we have collected such information,
            we will take steps to delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you
            of any changes by posting the new Privacy Policy on this page and
            updating the &quot;Last updated&quot; date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us:
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
