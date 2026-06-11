import { Building2, Heart, Mail, Phone, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  portal: [
    { label: "Patient Records", href: "#" },
    { label: "Lab Results", href: "#" },
    { label: "Imaging", href: "#" },
    { label: "Pharmacy Orders", href: "#" },
    { label: "Schedules", href: "#" },
  ],
  departments: [
    { label: "Emergency", href: "#" },
    { label: "Cardiology", href: "#" },
    { label: "Neurology", href: "#" },
    { label: "Pediatrics", href: "#" },
    { label: "Oncology", href: "#" },
  ],
  support: [
    { label: "IT Support", href: "#" },
    { label: "HR Portal", href: "#" },
    { label: "Training", href: "#" },
    { label: "Request Account", href: "#" },
    { label: "Documentation", href: "#" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0a2a5a] text-white">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0b5394] to-[#2196f3] flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-white" />
              </div>
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
              Providing world-class healthcare and medical education. Our integrated
              portal connects staff, faculty, and departments seamlessly.
            </p>

            {/* Contact */}
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
                <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                <span>Dhaka University Campus, Shahbagh, Dhaka 1000</span>
              </div>
            </div>
          </div>

          {/* Portal links */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Portal
            </p>
            <ul className="space-y-2.5">
              {footerLinks.portal.map((link) => (
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

          {/* Departments */}
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

          {/* Support */}
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

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} University Medical Center. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">
              Data Policy
            </a>
          </div>
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Made with <Heart size={11} className="text-red-400 fill-red-400" /> by UMC Tech Team
          </p>
        </div>
      </div>
    </footer>
  )
}
