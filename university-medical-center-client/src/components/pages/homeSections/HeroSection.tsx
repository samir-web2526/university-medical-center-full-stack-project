import { Building2, ArrowRight, Shield, Clock, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { icon: Stethoscope, value: "50+", label: "Expert Doctors" },
  { icon: Shield, value: "10K+", label: "Patients Served" },
  { icon: Clock, value: "24/7", label: "Emergency Service" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0b5394] via-[#0d62b5] to-[#2196f3]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRNMzQgMmgydjJoLTJ6bTggMGgydjJoLTJ6bTggMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Building2 size={14} className="text-white" />
              <span className="text-xs font-medium text-white/90">
                University Medical Center, JSTU
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Health,{" "}
              <span className="text-[#e8f4ff]">Our Priority</span>
            </h1>

            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              Comprehensive healthcare services for university staff, faculty,
              and students. Access medical records, book appointments, and
              connect with expert doctors — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#0b5394] hover:bg-white/90 font-semibold rounded-xl px-8 shadow-lg shadow-black/10"
              >
                <Link href="/auth/register" className="gap-2">
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl px-8"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mx-auto">
                  <stat.icon size={22} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
