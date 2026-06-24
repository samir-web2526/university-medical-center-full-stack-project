"use client";

import { ArrowRight, Shield, Clock, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

import hero1 from "@/assets/images/hero1.jpeg";
import hero2 from "@/assets/images/hero2.jpeg";

const slides = [hero1, hero2];

interface HeroSectionProps {
  doctorCount: number;
  visitCount: number;
}

export default function HeroSection({ doctorCount, visitCount }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Stethoscope, value: doctorCount > 0 ? `${doctorCount}+` : "0", label: "Expert Doctors" },
    { icon: Shield, value: visitCount > 0 ? `${visitCount.toLocaleString()}+` : "0", label: "Patients Served" },
    { icon: Clock, value: "24/7", label: "Emergency Service" },
  ];

  return (
    <section className="relative overflow-hidden h-150 md:h-162.5">
      <style jsx>{`
        .slide-image {
          transition: transform 10s ease-in-out, opacity 2s ease-in-out;
        }
        .slide-active .slide-image {
          transform: scale(1.08);
        }
        .slide-inactive .slide-image {
          transform: scale(1);
          transition: transform 3s ease-in-out, opacity 2s ease-in-out;
        }
      `}</style>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .hero-fade { animation: fadeUp 0.7s ease-out both; }
        .hero-fade-d1 { animation-delay: 0.1s; }
        .hero-fade-d2 { animation-delay: 0.2s; }
        .hero-fade-d3 { animation-delay: 0.3s; }
        .hero-fade-d4 { animation-delay: 0.4s; }
        .hero-fade-d5 { animation-delay: 0.5s; }
        .hero-fade-d6 { animation-delay: 0.6s; }
        .stat-card {
          animation: gentleFloat 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .stat-card:nth-child(1) { animation-delay: 0s; }
        .stat-card:nth-child(2) { animation-delay: 0.5s; }
        .stat-card:nth-child(3) { animation-delay: 1s; }
        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.22);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }
        .stat-icon {
          transition: all 0.3s ease;
        }
        .btn-hero-primary {
          position: relative;
          overflow: hidden;
          animation: btnFloat 2s ease-in-out infinite;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          z-index: 1;
        }
        .btn-hero-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0b5394, #0891b2, #2196f3);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
          z-index: -1;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .btn-hero-primary:hover::before {
          transform: scaleX(1);
        }
        .btn-hero-primary:hover {
          color: white;
          box-shadow: 0 10px 35px rgba(11, 83, 148, 0.5);
        }
        .btn-hero-primary:active {
          transform: translateY(0);
          animation: none;
        }
        .btn-hero-outline {
          transition: box-shadow 0.3s ease, background 0.3s ease;
          animation: btnFloat 2s ease-in-out infinite;
          animation-delay: 0.2s;
          box-shadow: 0 6px 20px rgba(255,255,255,0.15);
        }
        .btn-hero-outline:hover {
          background: rgba(255,255,255,0.15);
          box-shadow: 0 10px 35px rgba(255,255,255,0.25);
        }
        .btn-hero-outline:active {
          transform: translateY(0);
          animation: none;
        }
      `}</style>

      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = currentSlide === index;

        return (
          <div
            key={index}
            className={`absolute inset-0 ${isActive ? "slide-active" : "slide-inactive"}`}
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity 2s ease-in-out",
              zIndex: isActive ? 1 : 0,
            }}
          >
            <Image
              src={slide}
              alt={`Hero slide ${index + 1}`}
              fill
              className="object-cover slide-image"
              priority={index === 0}
            />
          </div>
        );
      })}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30" style={{ zIndex: 2 }} />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRNMzQgMmgydjJoLTJ6bTggMGgydjJoLTJ6bTggMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" style={{ zIndex: 3 }} />

      {/* Content */}
      <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center" style={{ zIndex: 4 }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight hero-fade">
              Your Health,{" "}
              <span className="text-[#e8f4ff]">Our Priority</span>
            </h1>

            <p className="text-lg text-white/80 max-w-lg leading-relaxed hero-fade hero-fade-d1">
              Quality healthcare for JSTU students — from checkups to medicines.
              Visit when you need, get treated with care. Your health matters to
              us, always.
            </p>

            <div className="flex flex-wrap gap-4 hero-fade hero-fade-d2">
              <Button
                asChild
                size="lg"
                className="btn-hero-primary bg-white text-gray-800 font-semibold rounded-xl px-8"
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
                className="btn-hero-outline border-white/40 text-white hover:bg-white/15 font-semibold rounded-xl px-8"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-6 text-center space-y-3 hero-fade"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="stat-icon w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto">
                  <stat.icon size={22} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3" style={{ zIndex: 4 }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
            }}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-10 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" style={{ zIndex: 3 }} />
    </section>
  );
}
