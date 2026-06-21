import {
  Building2,
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
      "We treat every patient with empathy, respect, and genuine concern for their well-being.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Service",
    description:
      "We maintain the highest standards of medical practice and patient safety.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Round-the-clock emergency services to ensure help is always available when needed.",
  },
];

interface AboutPageProps {
  doctorCount: number;
  visitCount: number;
}

export default function AboutPage({ doctorCount, visitCount }: AboutPageProps) {
  const stats = [
    { icon: Stethoscope, value: doctorCount > 0 ? `${doctorCount}+` : "0", label: "Expert Doctors" },
    { icon: Users, value: visitCount > 0 ? `${visitCount.toLocaleString()}+` : "0", label: "Patients Served" },
    { icon: Award, value: "5+", label: "Years of Service" },
    { icon: GraduationCap, value: "100%", label: "University Coverage" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b5394] via-[#0d62b5] to-[#2196f3]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRNMzQgMmgydjJoLTJ6bTggMGgydjJoLTJ6bTggMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Building2 size={14} className="text-white" />
              <span className="text-xs font-medium text-white/90">
                About UMC, JSTU
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              University Medical Center
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Your trusted healthcare partner at Jamalpur Science
              and Technology University. We provide comprehensive medical services with
              compassion and excellence.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dedicated to Your{" "}
                <span className="text-[#0b5394] dark:text-[#60a5fa]">
                  Well-being
                </span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The University Medical Center (UMC) at Jamalpur Science
                  and Technology University (JSTU) is a dedicated healthcare facility
                  committed to providing quality medical services to the university
                  community.
                </p>
                <p>
                  Our team of experienced doctors, medical technologists, and support
                  staff work tirelessly to ensure that students, faculty, and staff
                  receive the best possible care. From routine checkups to emergency
                  services, we are here to support your health journey.
                </p>
                <p>
                  We believe that a healthy community is a productive community.
                  That&apos;s why we strive to make healthcare accessible, affordable,
                  and efficient for everyone at JSTU.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="border border-border rounded-2xl p-8 bg-card shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center space-y-3">
                      <div className="w-14 h-14 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mx-auto">
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
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#0b5394]/10 dark:bg-[#2196f3]/10 rounded-full blur-3xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#2196f3]/10 dark:bg-[#60a5fa]/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
              Our Purpose
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-border rounded-2xl p-8 bg-card hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-6">
                <Target
                  size={26}
                  className="text-[#0b5394] dark:text-[#60a5fa]"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide accessible, affordable, and high-quality healthcare
                services to the JSTU community. We are committed to promoting
                health and wellness through preventive care, education, and
                compassionate medical treatment.
              </p>
            </div>

            <div className="border border-border rounded-2xl p-8 bg-card hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-6">
                <Eye
                  size={26}
                  className="text-[#0b5394] dark:text-[#60a5fa]"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To become a model university medical center that sets the standard
                for campus healthcare. We envision a future where every member of
                the JSTU community has seamless access to comprehensive medical
                services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
              Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do, from patient care to community
              engagement.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="group border border-border rounded-2xl p-6 bg-card hover:shadow-lg hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-4 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-colors duration-300">
                  <value.icon
                    size={22}
                    className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0b5394] via-[#0d62b5] to-[#2196f3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of JSTU community members who trust us with their
            healthcare needs. Register today and experience quality medical care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0b5394] hover:bg-white/90 font-semibold rounded-xl px-8 shadow-lg shadow-black/10"
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
              className="border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl px-8"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
