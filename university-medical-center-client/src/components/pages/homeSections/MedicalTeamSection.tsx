"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePublicDoctors } from "@/hooks/queries/useDoctorQueries";
import { User, Mail, Phone, Award, Stethoscope } from "lucide-react";

const INITIAL_COUNT = 3;

const gradients = [
  "from-[#0b5394] to-[#2196f3]",
  "from-[#1a7a5c] to-[#34d399]",
  "from-[#7c3aed] to-[#a78bfa]",
  "from-[#dc2626] to-[#f87171]",
  "from-[#d97706] to-[#fbbf24]",
  "from-[#0891b2] to-[#67e8f9]",
];

function getGradient(index: number) {
  return gradients[index % gradients.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function MedicalTeamSection() {
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading, isError } = usePublicDoctors(1, 100);
  const doctors = data?.data ?? [];
  const visibleDoctors = showAll ? doctors : doctors.slice(0, INITIAL_COUNT);
  const hasMore = doctors.length > INITIAL_COUNT;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Meet Our Medical Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team of experienced doctors and dedicated assistants are
            committed to providing you with the best possible care.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Badge
              variant="outline"
              className="border-[#0b5394]/30 dark:border-[#2196f3]/30 text-[#0b5394] dark:text-[#60a5fa] bg-[#e8f4ff] dark:bg-[#0b5394]/10 rounded-full px-4 py-1 text-xs font-semibold"
            >
              Doctors
            </Badge>
            <div className="flex-1 h-px bg-border" />
          </div>

          {isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: INITIAL_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="border border-border rounded-2xl p-6 bg-card animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-muted-foreground">
              Failed to load doctors. Please try again later.
            </div>
          )}

          {!isLoading && !isError && doctors.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No doctors available at the moment.
            </div>
          )}

          {!isLoading && !isError && doctors.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleDoctors.map((doctor, idx) => (
                  <div
                    key={doctor.id}
                    className="group border border-border rounded-2xl p-6 bg-card hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradient(idx)} flex items-center justify-center shrink-0 shadow-md`}
                      >
                        <span className="text-white font-bold text-sm">
                          {getInitials(doctor.user?.name ?? "DR")}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          {doctor.user?.name ?? "Unknown Doctor"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full cursor-pointer"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradient(idx)} flex items-center justify-center shadow-md`}
                            >
                              <span className="text-white font-bold text-xs">
                                {getInitials(doctor.user?.name ?? "DR")}
                              </span>
                            </div>
                            {doctor.user?.name ?? "Unknown Doctor"}
                          </DialogTitle>
                          <DialogDescription>
                            {doctor.specialization}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 mt-2">
                          <div className="flex items-center gap-3 text-sm">
                            <Stethoscope className="size-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Specialization:</span>
                            <span className="font-medium text-foreground">
                              {doctor.specialization}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <Award className="size-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Qualification:</span>
                            <span className="font-medium text-foreground">
                              {doctor.qualification}
                            </span>
                          </div>

                          {doctor.bmdcRegistrationNumber && (
                            <div className="flex items-center gap-3 text-sm">
                              <User className="size-4 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">BMDC Reg:</span>
                              <span className="font-medium text-foreground">
                                {doctor.bmdcRegistrationNumber}
                              </span>
                            </div>
                          )}

                          {doctor.user?.email && (
                            <div className="flex items-center gap-3 text-sm">
                              <Mail className="size-4 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">Email:</span>
                              <span className="font-medium text-foreground">
                                {doctor.user.email}
                              </span>
                            </div>
                          )}

                          {doctor.user?.phone && (
                            <div className="flex items-center gap-3 text-sm">
                              <Phone className="size-4 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">Phone:</span>
                              <span className="font-medium text-foreground">
                                {doctor.user.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  {!showAll ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowAll(true)}
                      className="cursor-pointer"
                    >
                      Show More
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowAll(false)}
                      className="cursor-pointer"
                    >
                      Show Less
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
