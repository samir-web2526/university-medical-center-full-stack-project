import {
  Stethoscope,
  Pill,
  Ambulance
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General Checkup",
    description:
      "Comprehensive health assessments and routine examinations by experienced physicians.",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description:
      "In-house pharmacy with prescribed medicines and essential healthcare products.",
  },
  {
    icon: Ambulance,
    title: "Emergency Care",
    description:
      "24/7 emergency medical services with rapid response team and ambulance support.",
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Comprehensive Healthcare
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From routine checkups to specialized treatments, we offer a wide
            range of medical services to keep you healthy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group border border-border rounded-2xl p-6 bg-card hover:shadow-lg hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-4 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-colors duration-300">
                <service.icon
                  size={22}
                  className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
