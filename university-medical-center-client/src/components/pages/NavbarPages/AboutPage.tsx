"use client";

import {
  Target,
  Eye,
  Heart,
  Users,
  ShieldCheck,
  Stethoscope,
  Clock,
  Award,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const values = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description:
      "We treat every student with empathy, respect, and genuine concern for their well-being.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Service",
    description:
      "We maintain the highest standards of medical practice and student safety.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Round-the-clock emergency services to ensure help is always available when you need it.",
  },
];

interface AboutPageProps {
  doctorCount: number;
  visitCount: number;
}

export default function AboutPage({ doctorCount, visitCount }: AboutPageProps) {
  const stats = [
    { icon: Stethoscope, value: doctorCount > 0 ? `${doctorCount}+` : "0", label: "Expert Doctors" },
    { icon: Users, value: visitCount > 0 ? `${visitCount.toLocaleString()}+` : "0", label: "Students Served" },
    { icon: Award, value: "5+", label: "Years of Service" },
    { icon: GraduationCap, value: "100%", label: "University Coverage" },
  ];

  return (
    <div>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(11, 83, 148, 0.4); }
          50% { box-shadow: 0 0 20px 10px rgba(11, 83, 148, 0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes btnFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
          opacity: 0;
        }
        .btn-about-primary {
          position: relative;
          overflow: hidden;
          animation: btnFloat 2s ease-in-out infinite;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          z-index: 1;
          isolation: isolate;
        }
        .btn-about-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0b5394, #0891b2, #2196f3) !important;
          background-size: 200% 200% !important;
          animation: gradientShift 3s ease infinite;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
          z-index: -1;
        }
        .btn-about-primary:hover::before {
          transform: scaleX(1) !important;
        }
        .btn-about-primary:hover {
          color: white !important;
          background: transparent !important;
          box-shadow: 0 10px 35px rgba(11, 83, 148, 0.5);
        }
        .btn-about-primary:active {
          transform: translateY(0);
          animation: none;
        }
        .btn-about-primary > * {
          position: relative;
          z-index: 2;
        }
        .btn-about-outline {
          transition: box-shadow 0.3s ease, background 0.3s ease;
          animation: btnFloat 2s ease-in-out infinite;
          animation-delay: 0.2s;
          box-shadow: 0 6px 20px rgba(255,255,255,0.15);
        }
        .btn-about-outline:hover {
          background: rgba(255,255,255,0.15);
          box-shadow: 0 10px 35px rgba(255,255,255,0.25);
        }
        .btn-about-outline:active {
          transform: translateY(0);
          animation: none;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
      `}</style>

      <section className="relative overflow-hidden bg-linear-to-br from-[#0b5394] via-[#0d62b5] to-[#2196f3]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRNMzQgMmgydjJoLTJ6bTggMGgydjJoLTJ6bTggMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float delay-300" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float delay-500" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up delay-200">
              University Medical Center
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-400">
              Your trusted healthcare partner at Jamalpur Science
              and Technology University. Dedicated to keeping every student
              healthy, focused, and thriving throughout their academic journey.
            </p>

            <div className="animate-fade-in-up delay-600">
              <Button
                asChild
                size="lg"
                className="btn-about-primary bg-white text-gray-800 font-semibold rounded-xl px-8"
              >
                <Link href="/auth/register" className="gap-2">
                  Register Now
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5 animate-fade-in-left">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in-left delay-200">
                Dedicated to Your{" "}
                <span className="text-[#0b5394] dark:text-[#60a5fa]">
                  Student Well-being
                </span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="animate-fade-in-left delay-300">
                  The University Medical Center (UMC) at Jamalpur Science
                  and Technology University (JSTU) is a dedicated healthcare facility
                  committed to providing quality medical services exclusively for
                  students.
                </p>
                <p className="animate-fade-in-left delay-400">
                  Our team of experienced doctors, medical technologists, and support
                  staff work tirelessly to ensure that every student receives the
                  best possible care. From routine checkups to emergency services,
                  we are here to support your health throughout your academic journey.
                </p>
                <p className="animate-fade-in-left delay-500">
                  We believe that healthy students achieve more. That&apos;s why we
                  strive to make healthcare accessible, affordable, and efficient
                  so you can focus on what matters most — your education.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="border border-border rounded-2xl p-8 bg-card shadow-lg animate-fade-in-right">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center space-y-3 animate-scale-in" style={{ animationDelay: `${index * 200}ms` }}>
                      <div className="w-14 h-14 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-[#0b5394]/20">
                        <stat.icon
                          size={24}
                          className="text-[#0b5394] dark:text-[#60a5fa]"
                        />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#0b5394]/10 dark:bg-[#2196f3]/10 rounded-full blur-3xl animate-float" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#2196f3]/10 dark:bg-[#60a5fa]/10 rounded-full blur-2xl animate-float delay-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5 animate-fade-in-up">
              Our Purpose
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in-up delay-200">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group border border-border rounded-2xl p-6 bg-card hover:shadow-xl hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-4 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Target
                  size={22}
                  className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-500"
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[#0b5394] dark:group-hover:text-[#60a5fa] transition-colors duration-300">
                Our Mission
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To provide accessible, affordable, and high-quality healthcare
                services to every student at JSTU. We are committed to promoting
                student health and wellness through preventive care, health education,
                and compassionate medical treatment.
              </p>
            </div>

            <div className="group border border-border rounded-2xl p-6 bg-card hover:shadow-xl hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-4 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Eye
                  size={22}
                  className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-500"
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[#0b5394] dark:group-hover:text-[#60a5fa] transition-colors duration-300">
                Our Vision
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To become a model university medical center that sets the standard
                for student healthcare. We envision a future where every student
                at JSTU has seamless access to comprehensive medical services,
                ensuring no one falls behind due to health concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5 animate-fade-in-up">
              Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in-up delay-200">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-300">
              Our values guide everything we do, from student care to campus
              wellness.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group border border-border rounded-2xl p-6 bg-card hover:shadow-xl hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-500 animate-bounce-in hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-4 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <value.icon
                    size={22}
                    className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[#0b5394] dark:group-hover:text-[#60a5fa] transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-br from-[#0b5394] via-[#0d62b5] to-[#2196f3] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-float" />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full animate-float delay-500" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-full animate-float delay-300" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-fade-in-up">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Join thousands of JSTU students who trust us with their
            healthcare needs. Register today and experience quality medical care.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-400">
            <Button
              asChild
              size="lg"
              className="btn-about-primary bg-white text-gray-800 font-semibold rounded-xl px-8"
            >
              <Link href="/auth/register" className="gap-2">
                Register Now
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-about-outline border-white/40 text-white hover:bg-white/15 font-semibold rounded-xl px-8"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
