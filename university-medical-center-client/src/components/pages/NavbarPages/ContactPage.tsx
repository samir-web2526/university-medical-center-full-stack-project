import { Mail, Phone, MapPin, User, Droplet, Stethoscope, Clock, Calendar } from "lucide-react";

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
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
            Contact Doctors
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Meet Our Medical Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with our experienced doctors and healthcare professionals.
            Reach out for appointments, consultations, or medical inquiries.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {contactInfo.map((info) => (
            <a
              key={info.label}
              href={info.href}
              className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0">
                <info.icon size={18} className="text-[#0b5394] dark:text-[#60a5fa]" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {info.label}
                </p>
                <p className="text-sm text-foreground font-medium">
                  {info.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.email}
              className="border border-border rounded-2xl overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0b5394] to-[#2196f3] p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
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

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0">
                    <Stethoscope size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Specialty</p>
                    <p className="text-sm font-medium text-foreground">{doctor.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0">
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

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${doctor.email}`}
                      className="text-sm font-medium text-foreground hover:text-[#0b5394] dark:hover:text-[#60a5fa] transition-colors truncate block max-w-[250px]"
                    >
                      {doctor.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0">
                    <Droplet size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Group</p>
                    <p className="text-sm font-medium text-foreground">{doctor.bloodGroup}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{doctor.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0">
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

        {/* Emergency Note */}
        <div className="mt-12 p-6 border border-[#0b5394]/20 dark:border-[#2196f3]/20 rounded-2xl bg-[#e8f4ff]/50 dark:bg-[#0b5394]/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0b5394] dark:bg-[#2196f3] flex items-center justify-center shrink-0">
              <Calendar size={18} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-1">
                Emergency Service
              </h4>
              <p className="text-sm text-muted-foreground">
                For medical emergencies, our team is available 24/7. Call the
                emergency hotline or visit the medical center directly. Your
                health and safety are our top priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
