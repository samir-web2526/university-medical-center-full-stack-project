"use client";

import { Mail, Phone, MapPin, User, Droplet, Stethoscope, Clock } from "lucide-react";

const doctors = [
  {
    name: "Nelima Nasrin",
    role: "Medical Officer",
    phone: "01786620246",
    email: "dr.nelima1990@gmail.com",
    bloodGroup: "B +ve",
    country: "Bangladesh",
    schedule: "Sun - Thu: 10:00 AM - 4:00 PM",
  },
  {
    name: "Kohinur Khatun Shimu",
    role: "Medical Technologist",
    phone: "01718838895",
    email: "kohinur.shimu007@gmail.com",
    bloodGroup: "O +ve",
    country: "Bangladesh",
    schedule: "Sun - Thu: 10:00 AM - 4:00 PM",
  },
];

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "01718838895",
    href: "tel:01718838895",
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

export default function ContactPage() {
  return (
    <section className="py-20 bg-background">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { box-shadow: 0 0 20px 8px rgba(220, 38, 38, 0.15); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes emergencyShow {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { opacity: 1; transform: translateY(0) scale(1); box-shadow: 0 0 20px 8px rgba(220, 38, 38, 0.15); }
          100% { opacity: 1; transform: translateY(0) scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
        }
        .anim-emergency {
          animation: emergencyShow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     pulseGlow 2s ease-in-out 0.8s infinite;
          opacity: 0;
        }
        .anim-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .anim-fade-left {
          animation: fadeInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .anim-fade-right {
          animation: fadeInRight 0.6s ease-out forwards;
          opacity: 0;
        }
        .anim-scale {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .anim-bounce {
          animation: bounceIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .anim-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5 anim-fade-up">
            Student Support
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground anim-fade-up delay-100">
            We&apos;re Here For You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto anim-fade-up delay-200">
            Have questions about health services? Need medical advice?
            Reach out to our doctors — we&apos;re always ready to help students.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {contactInfo.map((info, index) => (
            <a
              key={info.label}
              href={info.href}
              className="group flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:shadow-lg hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-500 hover:-translate-y-1 anim-scale"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <info.icon size={18} className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-[#0b5394] dark:group-hover:text-[#60a5fa] transition-colors duration-300">
                  {info.label}
                </p>
                <p className="text-sm text-foreground font-medium">
                  {info.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.email}
              className="group border border-border rounded-2xl overflow-hidden bg-card hover:shadow-xl hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-500 hover:-translate-y-2 anim-bounce"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-linear-to-r from-[#0b5394] to-[#2196f3] p-6 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full anim-float" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full anim-float delay-300" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <User size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-white/80 font-medium">
                      {doctor.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 group/row hover:bg-[#e8f4ff]/50 dark:hover:bg-[#0b5394]/5 p-2 -m-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-300">
                    <Stethoscope size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Specialty</p>
                    <p className="text-sm font-medium text-foreground">{doctor.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/row hover:bg-[#e8f4ff]/50 dark:hover:bg-[#0b5394]/5 p-2 -m-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-300">
                    <Phone size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${doctor.phone}`}
                      className="text-sm font-medium text-foreground hover:text-[#0b5394] dark:hover:text-[#60a5fa] transition-colors"
                    >
                      {doctor.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/row hover:bg-[#e8f4ff]/50 dark:hover:bg-[#0b5394]/5 p-2 -m-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-300">
                    <Mail size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${doctor.email}`}
                      className="text-sm font-medium text-foreground hover:text-[#0b5394] dark:hover:text-[#60a5fa] transition-colors truncate block max-w-62.5"
                    >
                      {doctor.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/row hover:bg-[#e8f4ff]/50 dark:hover:bg-[#0b5394]/5 p-2 -m-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-300">
                    <Droplet size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Group</p>
                    <p className="text-sm font-medium text-foreground">{doctor.bloodGroup}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/row hover:bg-[#e8f4ff]/50 dark:hover:bg-[#0b5394]/5 p-2 -m-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-300">
                    <MapPin size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{doctor.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/row hover:bg-[#e8f4ff]/50 dark:hover:bg-[#0b5394]/5 p-2 -m-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-300">
                    <Clock size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Working Hours</p>
                    <p className="text-sm font-medium text-foreground">{doctor.schedule}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 relative overflow-hidden rounded-2xl bg-linear-to-r from-red-500 via-red-600 to-rose-600 dark:from-red-600 dark:via-red-700 dark:to-rose-700 p-8 anim-emergency hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full anim-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full anim-float delay-300" />
          <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/5 rounded-full anim-float delay-500" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Stethoscope size={28} className="text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-white/40" style={{ animation: 'pulseRing 2s ease-out infinite' }} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                </span>
                <h4 className="text-xl font-bold text-white">
                  24/7 Student Emergency
                </h4>
              </div>
              <p className="text-sm text-white/90 leading-relaxed max-w-xl">
                Facing a health emergency on campus? Our medical team is available
                round the clock for all JSTU students. Don&apos;t hesitate — call now
                or visit the medical center immediately. Your life matters to us.
              </p>
              </div>
              <a
                href="tel:01718838895"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-white text-red-600 font-bold rounded-xl hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
              >
                <Phone size={16} />
                Call Emergency: 01718838895
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
