"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquareWarning, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";
import { createComplaint } from "@/services/complaint.service";
import type { CurrentUser } from "@/lib/auth";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+880 9612 345 678",
    href: "tel:+8809612345678",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@umc.edu.bd",
    href: "mailto:support@umc.edu.bd",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "JSTU Campus, Melandah, Jamalpur-2000",
    href: "#",
  },
];

interface ContactSectionProps {
  user: CurrentUser | null;
}

export default function ContactSection({ user }: ContactSectionProps) {
  const isStudent = user?.role === "STUDENT";
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    subject: "",
    message: "",
  });

  const handleChange = (key: string, value: string) => {
    if (key === "phone") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.phone && !/^\d{11}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 11 digits");
      return;
    }
    setSubmitting(true);
    const { error } = await createComplaint({
      name: form.name,
      phone: form.phone,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Complaint submitted successfully!");
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section className="py-20 bg-background">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes btnFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .btn-float {
          animation: btnFloat 2s ease-in-out infinite;
          box-shadow: 0 4px 15px rgba(11, 83, 148, 0.2);
        }
        .btn-float:hover {
          box-shadow: 0 8px 25px rgba(11, 83, 148, 0.4);
        }
        .btn-float:active {
          transform: translateY(0);
          animation: none;
        }
        .btn-float {
          animation: btnFloat 1.5s ease-in-out infinite;
        }
        .btn-float:hover {
          box-shadow: 0 8px 25px rgba(11, 83, 148, 0.4);
        }
        .btn-float:active {
          transform: translateY(0) scale(0.97);
          animation: none;
        }
        .contact-fade { animation: fadeUp 0.6s ease-out both; }
        .contact-fade-d1 { animation-delay: 0.1s; }
        .contact-fade-d2 { animation-delay: 0.2s; }
        .contact-fade-d3 { animation-delay: 0.3s; }
        .contact-fade-d4 { animation-delay: 0.4s; }
        .contact-fade-d5 { animation-delay: 0.5s; }
        .contact-info-item {
          transition: all 0.3s ease;
          border-radius: 0.75rem;
          padding: 0.75rem;
          margin: -0.75rem;
        }
        .contact-info-item:hover {
          animation: floatUp 2s ease-in-out infinite;
          background: rgba(11, 83, 148, 0.03);
        }
        .contact-form-card {
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .contact-form-card:hover {
          box-shadow: 0 8px 25px rgba(11, 83, 148, 0.08);
          border-color: rgba(11, 83, 148, 0.15);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14 contact-fade">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
            Complaint Box
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Submit a Complaint
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have an issue or feedback? Send your complaint to the admin and we
            will address it as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6 contact-fade contact-fade-d1">
            <div className="space-y-5">
              {contactInfo.map((info, index) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="contact-info-item flex items-start gap-4 group"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-colors duration-300">
                    <info.icon
                      size={18}
                      className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {info.label}
                    </p>
                    <p className="text-sm text-foreground font-medium mt-0.5">
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                Working Hours
              </p>
              <p className="text-sm text-foreground">Sun - Thu: 10:00 AM - 4:00 PM</p>
              <p className="text-sm text-muted-foreground mt-1">
                Emergency: 24/7 Available
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 border border-border rounded-2xl p-6 bg-card contact-form-card contact-fade contact-fade-d2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center">
                <MessageSquareWarning size={18} className="text-[#0b5394] dark:text-[#60a5fa]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Complaint Form</h3>
                <p className="text-xs text-muted-foreground">Send your complaint to admin</p>
              </div>
            </div>

            {isStudent ? (
              submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                    <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">
                      Complaint Submitted!
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Your complaint has been sent to the admin. We will address it as soon as possible.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl gap-2"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Complaint
                  </Button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      placeholder="Your name"
                      className="rounded-xl border-border h-11"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      placeholder="Your phone number"
                      className="rounded-xl border-border h-11"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="rounded-xl border-border h-11"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <Input
                    placeholder="Complaint subject"
                    className="rounded-xl border-border h-11"
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Complaint Details
                  </label>
                  <Textarea
                    placeholder="Describe your complaint in detail..."
                    rows={4}
                    className="rounded-xl border-border resize-none"
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="btn-float w-full bg-gradient-to-r from-[#0b5394] to-[#2196f3] text-white font-semibold rounded-xl h-11 gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Complaint
                    </>
                  )}
                </Button>
              </form>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center">
                  {user ? (
                    <AlertCircle size={28} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  ) : (
                    <LogIn size={28} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">
                    {user ? "Students Only" : "Login Required"}
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {user
                      ? "Only students can submit complaints. Please use your student account to access this feature."
                      : "Please login as a student to submit a complaint to the admin."}
                  </p>
                </div>
                {!user && (
                  <Button
                    asChild
                    className="btn-float bg-gradient-to-r from-[#0b5394] to-[#2196f3] text-white font-semibold rounded-xl px-6 gap-2"
                  >
                    <Link href="/auth/login">
                      <LogIn size={16} />
                      Login as Student
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
