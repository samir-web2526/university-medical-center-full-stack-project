import { Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  departments: [
    { label: "Emergency", href: "#" },
    { label: "General Medicine", href: "#" },

  ],
  support: [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" }
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0a2a5a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image src={logo} alt="UMC Logo" width={36} height={36} className="rounded-lg shrink-0" />
              <div>
                <p className="text-sm font-semibold leading-tight">
                  University Medical Center
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Staff &amp; Faculty Portal
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
             Dedicated to improving student experiences through accessible services and digital innovation.
            </p>

            <div className="space-y-2">
              <a
                href="tel:+8809612345678"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Phone size={13} />
                +880 9612 345 678
              </a>
              <a
                href="mailto:support@umc.edu.bd"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Mail size={13} />
                support@umc.edu.bd
              </a>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <MapPin size={13} className="mt-0.5 shrink-0" />
                <span>JSTU Campus, Melandah, Jamalpur-2000</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Departments
            </p>
            <ul className="space-y-2.5">
              {footerLinks.departments.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Support
            </p>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} University Medical Center. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Made by Samir Baishnab
          </p>
        </div>
      </div>
    </footer>
  )
}
