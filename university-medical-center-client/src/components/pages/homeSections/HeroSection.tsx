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
    <section className="relative overflow-hidden h-[600px] md:h-[650px]">
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" style={{ zIndex: 2 }} />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRtMCA4djItSDJ2LTJoMzRNMzQgMmgydjJoLTJ6bTggMGgydjJoLTJ6bTggMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" style={{ zIndex: 3 }} />

      {/* Content */}
      <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center" style={{ zIndex: 4 }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Health,{" "}
              <span className="text-[#e8f4ff]">Our Priority</span>
            </h1>

            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              Quality healthcare for JSTU students — from checkups to medicines.
              Visit when you need, get treated with care. Your health matters to
              us, always.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-gray-800 hover:bg-white/90 font-semibold rounded-xl px-8 shadow-lg shadow-black/10"
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
                className="border-white/40 text-white hover:bg-white/15 font-semibold rounded-xl px-8"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-6 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto">
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
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" style={{ zIndex: 3 }} />
    </section>
  );
}
