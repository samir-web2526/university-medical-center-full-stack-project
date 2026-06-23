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
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .service-fade { animation: fadeUp 0.6s ease-out both; }
        .service-fade-d1 { animation-delay: 0.1s; }
        .service-card {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .service-card-inner {
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.5rem;
          background: var(--card);
        }
        .service-card-inner:hover {
          animation: floatUp 2s ease-in-out infinite;
          box-shadow: 0 8px 25px rgba(11, 83, 148, 0.12);
          border-color: rgba(11, 83, 148, 0.2);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14 service-fade">
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
          {services.map((service, index) => (
            <div
              key={service.title}
              className="service-card cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="service-card-inner group">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
