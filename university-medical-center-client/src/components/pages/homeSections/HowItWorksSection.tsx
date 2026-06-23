import { UserPlus, UserRound, FileText, Pill, Bell } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Student registers and creates a portal account to access medical services.",
  },
  {
    icon: UserRound,
    step: "02",
    title: "Visit Doctor",
    description: "Student visits a doctor for consultation and medical examination.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Get Prescription",
    description: "Doctor creates a visit and provides a detailed prescription with diagnosis.",
  },
  {
    icon: Pill,
    step: "04",
    title: "Receive Medicine",
    description: "Doctor prescribes medicines which student can collect from the pharmacy.",
  },
  {
    icon: Bell,
    step: "05",
    title: "Get Notified",
    description: "Student receives notifications about visits, prescriptions, and updates.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/40">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .step-card {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .step-card-inner {
          transition: box-shadow 0.3s ease, background 0.3s ease;
          border-radius: 0.5rem;
          padding: 0.5rem;
          margin: -0.5rem;
        }
        .step-card-inner:hover {
          animation: floatUp 2s ease-in-out infinite;
          box-shadow: 0 8px 25px rgba(11, 83, 148, 0.12);
          background: rgba(255,255,255,0.03);
        }
        .step-card-inner:hover .step-icon {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(11, 83, 148, 0.15);
        }
        .step-icon {
          transition: all 0.3s ease;
        }
        .step-badge {
          transition: all 0.3s ease;
        }
        .step-card:hover .step-badge {
          transform: scale(1.1);
        }
        .steps-header { animation: fadeUp 0.6s ease-out both; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14 steps-header">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Simple Steps to Better Health
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting started with our medical services is quick and easy.
            Follow these simple steps to access quality healthcare.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="step-card relative text-center cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[55%] w-[90%] h-px bg-border" />
              )}

              <div className="step-card-inner space-y-4">
                <div className="relative inline-flex">
                  <div className="step-icon w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <step.icon size={28} className="text-[#0b5394] dark:text-[#60a5fa]" />
                  </div>
                  <span className="step-badge absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0b5394] dark:bg-[#2196f3] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {step.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
