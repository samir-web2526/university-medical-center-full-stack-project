import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+880 9612 345 678",
    href: "tel:+8809612345678",
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
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-5">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center shrink-0 group-hover:bg-[#0b5394] dark:group-hover:bg-[#2196f3] transition-colors duration-300">
                    <info.icon
                      size={18}
                      className="text-[#0b5394] dark:text-[#60a5fa] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {info.label}
                    </p>
                    <p className="text-sm text-foreground font-medium mt-0.5">
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                Working Hours
              </p>
              <p className="text-sm text-foreground">Sun - Thu: 10:00 AM - 4:00 PM</p>
              <p className="text-sm text-muted-foreground mt-1">
                Emergency: 24/7 Available
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 border border-border rounded-2xl p-6 bg-card">
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    className="rounded-xl border-border h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <Input
                    type="number"
                    placeholder="your phone number"
                    className="rounded-xl border-border h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input
                  placeholder="How can we help?"
                  className="rounded-xl border-border h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  placeholder="Write your message here..."
                  rows={4}
                  className="rounded-xl border-border resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0b5394] to-[#2196f3] hover:opacity-90 text-white font-semibold rounded-xl h-11 gap-2 transition-opacity"
              >
                <Send size={15} />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
