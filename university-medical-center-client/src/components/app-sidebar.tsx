"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Tag,
  Star,
  Search,
  Pill,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

const ADMIN_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "All Students",
        url: "/dashboard/all-students",
        icon: Search,
      },
      {
        title: "All Doctors",
        url: "/dashboard/all-doctors",
        icon: Search,
      },
      {
        title: "All Prescriptions",
        url: "/dashboard/all-prescriptions",
        icon: Search,
      },
      {
        title: "All Visits",
        url: "/dashboard/all-visits",
        icon: Search,
      },
      {
        title: "All Medicines",
        url: "/dashboard/all-medicines",
        icon: Pill,
      },
       {
        title: "All Notifications",
        url: "/dashboard/all-notifications",
        icon: Star,
      },
      {
        title: "Create Doctor",
        url: "/dashboard/create-doctor",
        icon: Tag,
      },
      {
        title: "Create Medicine",
        url: "/dashboard/create-medicine",
        icon: Tag,
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
    ],
  },
];

const STUDENT_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Prescriptions",
        url: "/dashboard/prescriptions",
        icon: Search,
      },
      {
        title: "My Visits",
        url: "/dashboard/visits",
        icon: Search,
      },
      {
        title: "My notifications",
        url: "/dashboard/notifications",
        icon: Search,
      },
      {
        title: "Medicines",
        url: "/dashboard/medicines",
        icon: Pill,
      },
      {
        title: "Update Profile",
        url: "/dashboard/update-profile",
        icon: Tag,
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
    ],
  },
];

const DOCTOR_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Patients",
        url: "/dashboard/patients",
        icon: UserCircle,
      },
      {
        title: "Medicines",
        url: "/dashboard/medicines",
        icon: Pill,
      },
      {
        title: "My Prescriptions",
        url: "/dashboard/prescriptions",
        icon: Search,
      },
      {
        title: "Create Visits",
        url: "/dashboard/create-visit",
        icon: CalendarDays,
      },
       {
        title: "Create Prescription",
        url: "/dashboard/create-prescription",
        icon: Tag,
      },
      {
        title: "Update Profile",
        url: "/dashboard/update-profile",
        icon: Tag,
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
    ],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: "ADMIN" | "STUDENT" | "DOCTOR";
  userName: string;
  userEmail: string;
}

export function AppSidebar({
  userRole,
  userName,
  userEmail,
  ...props
}: AppSidebarProps) {
  let navItem = null;
  if (userRole === "ADMIN") {
    navItem = ADMIN_NAV;
  } else if (userRole === "DOCTOR") {
    navItem = DOCTOR_NAV;
  } else {
    navItem = STUDENT_NAV;
  }
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">SkillBridge</span>
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {userRole} Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItem} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: userEmail,
            avatar: "",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
